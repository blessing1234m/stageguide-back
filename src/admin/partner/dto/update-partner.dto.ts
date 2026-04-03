import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdatePartnerDto {
  @ApiPropertyOptional({
    example: 'Orange Cameroun',
    description: 'Nom de l entreprise partenaire',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  nomEntreprise?: string;

  @ApiPropertyOptional({
    example: 'Douala',
    description: 'Ville principale du partenaire',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  ville?: string;

  @ApiPropertyOptional({
    example: 'contact@orange.cm',
    description: 'Adresse email de contact du partenaire',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

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
