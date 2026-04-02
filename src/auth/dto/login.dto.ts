import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'jean.dupont@stageguide.com',
    description: 'Adresse email du compte',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password1',
    description: 'Mot de passe du compte',
  })
  @IsString()
  @MinLength(1)
  password!: string;
}
