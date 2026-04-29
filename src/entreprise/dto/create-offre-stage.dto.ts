import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOffreStageDto {
  @ApiProperty({ example: 'Developpeur Frontend' })
  @IsString()
  @MinLength(1)
  titre!: string;

  @ApiProperty({ example: 'Nous recherchons un stagiaire pour notre equipe frontend.' })
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiProperty({ example: 'Douala' })
  @IsString()
  @MinLength(1)
  ville!: string;

  @ApiPropertyOptional({ example: 'Developpement web' })
  @IsOptional()
  @IsString()
  domaine?: string;

  @ApiPropertyOptional({ example: '6 mois' })
  @IsOptional()
  @IsString()
  duree?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  remote?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: '2026-09-30T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  dateExpiration?: string;
}
