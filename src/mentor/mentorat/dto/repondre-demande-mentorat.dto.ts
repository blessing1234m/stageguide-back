import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class RepondreDemandeMentoratDto {
  @ApiProperty({ example: 'ACCEPTEE', enum: ['ACCEPTEE', 'REFUSEE'] })
  @IsIn(['ACCEPTEE', 'REFUSEE'])
  decision!: 'ACCEPTEE' | 'REFUSEE';
}
