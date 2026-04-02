import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.token.example',
    description: 'Refresh token JWT utilise pour renouveler la session',
  })
  @IsString()
  @MinLength(1)
  refreshToken!: string;
}
