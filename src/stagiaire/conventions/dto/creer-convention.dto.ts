import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreerConventionDto {
  @ApiProperty({ example: 'Orange Cameroun' })
  @IsString()
  @MinLength(1)
  entrepriseNom!: string;

  @ApiPropertyOptional({ example: 'Jean Mentor' })
  @IsOptional()
  @IsString()
  mentorNom?: string;

  @ApiPropertyOptional({
    example: '2026-04-01',
    description: 'Date de debut du stage',
  })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({
    example: '2026-09-30',
    description: 'Date de fin du stage',
  })
  @IsOptional()
  @IsDateString()
  dateFin?: string;
}
