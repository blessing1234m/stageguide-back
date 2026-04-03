import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '../../../users/enums/user-role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: UserRole,
    example: UserRole.MENTOR,
    description: 'Nouveau role attribue a l utilisateur',
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
