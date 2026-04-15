import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class ModifierProfilMentorDto {
  @ApiPropertyOptional({ example: '+33 6 12 34 56 78' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ example: 'StageGuide' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  entreprise?: string;

  @ApiPropertyOptional({ example: 'Developpeur senior' })
  @IsOptional()
  @IsString()
  poste?: string;

  @ApiPropertyOptional({ example: 'Mentor passionne par l accompagnement des stagiaires.' })
  @IsOptional()
  @IsString()
  bio?: string;
}
