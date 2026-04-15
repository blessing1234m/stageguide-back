import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreerDemandeMentoratDto {
  @ApiPropertyOptional({ example: 'mentor-uuid' })
  @IsOptional()
  @IsString()
  mentorId?: string;

  @ApiPropertyOptional({ example: 'Je souhaite etre accompagne en developpement backend.' })
  @IsOptional()
  @IsString()
  message?: string;
}
