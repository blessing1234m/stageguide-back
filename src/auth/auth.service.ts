import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type { StringValue } from 'ms';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../users/enums/user-role.enum';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates credentials without leaking whether the email or password failed.
   */
  async validateUser(email: string, password: string): Promise<SafeUser> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Registers a new user and immediately issues an authenticated session.
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Un compte existe deja avec cet email');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      prenom: registerDto.prenom,
      nom: registerDto.nom,
      telephone: registerDto.telephone,
      ecole: registerDto.ecole,
      niveauEtudes: registerDto.niveauEtudes,
      entreprise: registerDto.entreprise,
      poste: registerDto.poste,
      bio: registerDto.bio,
      role: registerDto.role as UserRole,
      consentGiven: registerDto.consentGiven,
      consentDate: registerDto.consentGiven ? new Date() : null,
    });

    return this.createSession(user);
  }

  /**
   * Authenticates a user and returns a fresh access/refresh token pair.
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return this.createSession(user);
  }

  /**
   * Issues a session for an already authenticated user.
   */
  async loginUser(user: SafeUser) {
    return this.createSession(user);
  }

  /**
   * Rotates a refresh token after verifying its signature and hashed database record.
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(refreshTokenDto.refreshToken);
    const storedToken = await this.findValidStoredRefreshToken(
      payload.sub,
      refreshTokenDto.refreshToken,
    );

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token invalide');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Non autorise');
    }

    return this.createSession(user);
  }

  /**
   * Revokes an active refresh token so it can no longer be used.
   */
  async logout(refreshTokenDto: RefreshTokenDto): Promise<{ message: string }> {
    const payload = await this.verifyRefreshToken(refreshTokenDto.refreshToken);
    const storedToken = await this.findValidStoredRefreshToken(
      payload.sub,
      refreshTokenDto.refreshToken,
    );

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token invalide');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    return { message: 'Deconnexion reussie' };
  }

  /**
   * Builds signed JWTs and stores the hashed refresh token for rotation/revocation.
   */
  private async createSession(user: SafeUser) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as StringValue,
    });

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti: randomUUID() },
      {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'REFRESH_TOKEN_EXPIRES_IN',
          '7d',
        ) as StringValue,
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenHash,
        userId: user.id,
        expiresAt: this.computeRefreshTokenExpiry(),
      },
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalide');
    }
  }

  private async findValidStoredRefreshToken(
    userId: string,
    candidateToken: string,
  ): Promise<RefreshToken | null> {
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    for (const storedToken of storedTokens) {
      const isMatch = await bcrypt.compare(candidateToken, storedToken.token);

      if (isMatch) {
        return storedToken;
      }
    }

    return null;
  }

  private computeRefreshTokenExpiry(): Date {
    const configuredValue = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
      '7d',
    );
    const match = configuredValue.match(/^(\d+)([smhd])$/);

    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + amount * multipliers[unit]);
  }
}
