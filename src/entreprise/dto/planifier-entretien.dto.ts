import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class PlanifierEntretienDto {
  @ApiProperty({ example: '80e8cec9-1234-4a2b-8b34-5d31c5f74fd7' })
  @IsString()
  @MinLength(1)
  candidatureId!: string;

  @ApiProperty({ example: '2026-05-10T14:00:00Z' })
  @IsDateString()
  dateProposee!: string;

  @ApiPropertyOptional({ example: 'Visio Teams' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  lieu?: string;

  @ApiPropertyOptional({ example: 'Entretien avec le responsable technique.' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  message?: string;
}
