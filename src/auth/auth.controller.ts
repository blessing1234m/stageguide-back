import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Inscription d un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur inscrit avec succes' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 201, description: 'Session utilisateur creee' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() _loginDto: LoginDto,
    @Request() request: { user: Parameters<AuthService['loginUser']>[0] },
  ) {
    return this.authService.loginUser(request.user);
  }

  @ApiOperation({ summary: 'Rotation du refresh token' })
  @ApiResponse({ status: 201, description: 'Nouveaux tokens emis' })
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @ApiOperation({ summary: 'Deconnexion et revocation du refresh token' })
  @ApiResponse({ status: 201, description: 'Refresh token revoque' })
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recupere le profil de l utilisateur connecte' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur retourne' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: unknown) {
    return user;
  }
}
