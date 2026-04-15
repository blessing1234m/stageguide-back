import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class ModifierProjetDto {
  @ApiPropertyOptional({ example: 'Application de gestion de stages' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  titre?: string;

  @ApiPropertyOptional({ example: 'Projet realise en NestJS et React.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['React', 'Node.js', 'Stripe'],
    description: 'Liste des tags associes au projet',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    example: 'https://images.example.com/projet-react.jpg',
    description: 'Image de couverture du projet',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'https://portfolio.example.com/projets/e-commerce-react',
    description: 'Lien public du projet',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  lienProjet?: string;
}
