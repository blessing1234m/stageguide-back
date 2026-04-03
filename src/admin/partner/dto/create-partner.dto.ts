import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({
    example: 'Orange Cameroun',
    description: 'Nom de l entreprise partenaire',
  })
  @IsString()
  @MinLength(1)
  nomEntreprise!: string;

  @ApiProperty({
    example: 'Douala',
    description: 'Ville principale du partenaire',
  })
  @IsString()
  @MinLength(1)
  ville!: string;

  @ApiProperty({
    example: 'contact@orange.cm',
    description: 'Adresse email de contact du partenaire',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    example: 'https://www.orange.cm',
    description: 'Lien du site web du partenaire',
  })
  @IsOptional()
  @IsUrl(
    { require_protocol: true },
    { message: 'Le lien du site web doit etre une URL valide' },
  )
  lienSiteWeb?: string;
}
