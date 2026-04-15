import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreerCandidatureDto {
  @ApiPropertyOptional({ example: 'offre-stage-uuid' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  offreStageId?: string;

  @ApiPropertyOptional({ example: 'offre-emploi-uuid' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  offreEmploiId?: string;

  @ApiPropertyOptional({ example: 'Je souhaite rejoindre votre entreprise.' })
  @IsOptional()
  @IsString()
  message?: string;
}
