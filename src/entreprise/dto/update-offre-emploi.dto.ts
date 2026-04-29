import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateOffreEmploiDto {
  @ApiPropertyOptional({ example: 'Developpeur Backend' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  titre?: string;

  @ApiPropertyOptional({ example: 'Description actualisee du poste.' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @ApiPropertyOptional({ example: 'Yaounde' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  ville?: string;

  @ApiPropertyOptional({ example: 'Infrastructure' })
  @IsOptional()
  @IsString()
  domaine?: string;

  @ApiPropertyOptional({ example: 'CDI' })
  @IsOptional()
  @IsString()
  typeContrat?: string;

  @ApiPropertyOptional({ example: '3 ans' })
  @IsOptional()
  @IsString()
  experience?: string;

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
