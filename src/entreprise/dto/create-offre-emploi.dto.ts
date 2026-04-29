import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOffreEmploiDto {
  @ApiProperty({ example: 'Developpeur Backend' })
  @IsString()
  @MinLength(1)
  titre!: string;

  @ApiProperty({ example: 'Poste senior pour notre equipe backend.' })
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiProperty({ example: 'Yaounde' })
  @IsString()
  @MinLength(1)
  ville!: string;

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
