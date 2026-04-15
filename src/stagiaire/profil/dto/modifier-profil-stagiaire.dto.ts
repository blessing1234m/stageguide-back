import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class ModifierProfilStagiaireDto {
  @ApiPropertyOptional({ example: '+33 6 12 34 56 78' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ example: 'Universite de Douala' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  ecole?: string;

  @ApiPropertyOptional({ example: 'Master 1' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  niveauEtudes?: string;

  @ApiPropertyOptional({ example: 'Etudiant passionne par le developpement web.' })
  @IsOptional()
  @IsString()
  bio?: string;
}
