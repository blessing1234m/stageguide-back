import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/enums/user-role.enum';
import { AdminService } from './admin.service';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Liste tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des comptes utilisateurs',
  })
  @Get('users')
  async findAllUsers(@Query() query: ListUsersQueryDto) {
    return this.adminService.findAllUsers(query);
  }

  @ApiOperation({ summary: 'Recupere le detail d un utilisateur' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de l utilisateur cible',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur retourne avec succes',
  })
  @Get('users/:id')
  async findUserById(@Param('id') userId: string) {
    return this.adminService.findUserById(userId);
  }

  @ApiOperation({ summary: 'Suspend ou reactive un utilisateur' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de l utilisateur cible',
  })
  @ApiResponse({
    status: 200,
    description: 'Statut utilisateur mis a jour avec succes',
  })
  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @CurrentUser() currentUser: { id: string },
  ) {
    return this.adminService.updateUserStatus(
      currentUser.id,
      userId,
      updateUserStatusDto.isActive,
    );
  }

  @ApiOperation({ summary: 'Met a jour le role d un utilisateur' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de l utilisateur cible',
  })
  @ApiResponse({
    status: 200,
    description: 'Role utilisateur mis a jour avec succes',
  })
  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @CurrentUser() currentUser: { id: string },
  ) {
    return this.adminService.updateUserRole(
      currentUser.id,
      userId,
      updateUserRoleDto.role,
    );
  }

  @ApiOperation({ summary: 'Met a jour les informations d un utilisateur' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de l utilisateur cible',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis a jour avec succes',
  })
  @Patch('users/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: { id: string },
  ) {
    return this.adminService.updateUser(currentUser.id, userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Supprime logiquement un utilisateur' })
  @ApiParam({
    name: 'id',
    description: 'Identifiant UUID de l utilisateur cible',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprime logiquement avec succes',
  })
  @Delete('users/:id')
  async softDeleteUser(
    @Param('id') userId: string,
    @CurrentUser() currentUser: { id: string },
  ) {
    return this.adminService.softDeleteUser(currentUser.id, userId);
  }
}
