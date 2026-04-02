import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserStatusDto {
  @ApiProperty({
    example: false,
    description: 'Etat du compte utilisateur. false suspend, true reactive.',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive!: boolean;
}
