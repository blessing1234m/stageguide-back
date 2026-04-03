import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../users/enums/user-role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'jean.dupont@stageguide.com',
    description: 'Nouvelle adresse email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Jean',
    description: 'Nouveau prenom',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  prenom?: string;

  @ApiPropertyOptional({
    example: 'Dupont',
    description: 'Nouveau nom',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  nom?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.MENTOR,
    description: 'Nouveau role attribue a l utilisateur',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    example: true,
    description: 'Active ou suspend le compte',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) {
      return true;
    }
    if (value === 'false' || value === false) {
      return false;
    }
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
