import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminAction, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '../../users/enums/user-role.enum';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AdminUserService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeUser(user: User): SafeUser {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private async getManagedUserOrThrow(userId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  private async ensureAdminSafeguards(
    adminId: string,
    targetUser: User,
    nextState: Partial<Pick<User, 'isActive' | 'role'>> = {},
  ): Promise<void> {
    if (adminId === targetUser.id && nextState.isActive === false) {
      throw new ForbiddenException(
        'Vous ne pouvez pas suspendre votre propre compte',
      );
    }

    const nextRole = nextState.role ?? targetUser.role;
    const nextIsActive = nextState.isActive ?? targetUser.isActive;

    const isTargetAdmin = targetUser.role === UserRole.ADMIN;
    const losesAdminPrivileges = nextRole !== UserRole.ADMIN;
    const becomesInactive = nextIsActive === false;

    if (isTargetAdmin && (losesAdminPrivileges || becomesInactive)) {
      const activeAdminCount = await this.prisma.user.count({
        where: {
          role: UserRole.ADMIN,
          isActive: true,
          deletedAt: null,
        },
      });

      if (activeAdminCount <= 1) {
        throw new BadRequestException(
          'Au moins un administrateur actif doit rester',
        );
      }
    }
  }

  private async writeAuditLog(
    adminId: string,
    targetUserId: string,
    action: AdminAction,
    metadata?: Prisma.InputJsonValue,
  ): Promise<void> {
    await this.prisma.adminAuditLog.create({
      data: {
        adminId,
        targetUserId,
        action,
        metadata,
      },
    });
  }

  async findAllUsers(query: ListUsersQueryDto): Promise<{
    data: SafeUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(query.role ? { role: query.role } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? {
            OR: [
              { email: { contains: query.search, mode: 'insensitive' } },
              { prenom: { contains: query.search, mode: 'insensitive' } },
              { nom: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findUserById(userId: string): Promise<SafeUser> {
    return this.sanitizeUser(await this.getManagedUserOrThrow(userId));
  }

  async updateUserStatus(
    adminId: string,
    userId: string,
    isActive: boolean,
  ): Promise<SafeUser> {
    const existingUser = await this.getManagedUserOrThrow(userId);
    await this.ensureAdminSafeguards(adminId, existingUser, { isActive });

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    if (!isActive) {
      await this.prisma.refreshToken.updateMany({
        where: {
          userId,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });
    }

    await this.writeAuditLog(adminId, userId, AdminAction.USER_STATUS_UPDATED, {
      isActive,
    });

    return this.sanitizeUser(updatedUser);
  }

  async updateUserRole(
    adminId: string,
    userId: string,
    role: UserRole,
  ): Promise<SafeUser> {
    const existingUser = await this.getManagedUserOrThrow(userId);
    await this.ensureAdminSafeguards(adminId, existingUser, { role });

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await this.writeAuditLog(adminId, userId, AdminAction.USER_ROLE_UPDATED, {
      role,
    });

    return this.sanitizeUser(updatedUser);
  }

  async updateUser(
    adminId: string,
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SafeUser> {
    const existingUser = await this.getManagedUserOrThrow(userId);
    const normalizedEmail = updateUserDto.email?.toLowerCase();

    if (normalizedEmail && normalizedEmail !== existingUser.email) {
      const emailOwner = await this.prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          deletedAt: null,
          NOT: { id: userId },
        },
      });

      if (emailOwner) {
        throw new ConflictException('Un compte existe deja avec cet email');
      }
    }

    await this.ensureAdminSafeguards(adminId, existingUser, {
      role: updateUserDto.role,
      isActive: updateUserDto.isActive,
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(normalizedEmail ? { email: normalizedEmail } : {}),
        ...(updateUserDto.prenom ? { prenom: updateUserDto.prenom } : {}),
        ...(updateUserDto.nom ? { nom: updateUserDto.nom } : {}),
        ...(updateUserDto.role ? { role: updateUserDto.role } : {}),
        ...(updateUserDto.isActive !== undefined
          ? { isActive: updateUserDto.isActive }
          : {}),
      },
    });

    if (updateUserDto.isActive === false) {
      await this.prisma.refreshToken.updateMany({
        where: {
          userId,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });
    }

    const metadata: Record<string, string | boolean> = {};

    if (normalizedEmail !== undefined) {
      metadata.email = normalizedEmail;
    }
    if (updateUserDto.prenom !== undefined) {
      metadata.prenom = updateUserDto.prenom;
    }
    if (updateUserDto.nom !== undefined) {
      metadata.nom = updateUserDto.nom;
    }
    if (updateUserDto.role !== undefined) {
      metadata.role = updateUserDto.role;
    }
    if (updateUserDto.isActive !== undefined) {
      metadata.isActive = updateUserDto.isActive;
    }

    await this.writeAuditLog(adminId, userId, AdminAction.USER_UPDATED, {
      ...metadata,
    });

    return this.sanitizeUser(updatedUser);
  }

  async softDeleteUser(
    adminId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const existingUser = await this.getManagedUserOrThrow(userId);

    if (adminId === existingUser.id) {
      throw new ForbiddenException(
        'Vous ne pouvez pas supprimer votre propre compte',
      );
    }

    await this.ensureAdminSafeguards(adminId, existingUser, {
      isActive: false,
      role: UserRole.STAGIAIRE,
    });

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      }),
      this.prisma.refreshToken.updateMany({
        where: {
          userId,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      }),
      this.prisma.adminAuditLog.create({
        data: {
          adminId,
          targetUserId: userId,
          action: AdminAction.USER_SOFT_DELETED,
        },
      }),
    ]);

    return { message: 'Utilisateur supprime avec succes' };
  }
}
