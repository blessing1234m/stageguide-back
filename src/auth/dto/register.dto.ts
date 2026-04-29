import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Match } from '../validators/match.decorator';
import { UserRole } from '../../users/enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'jean.dupont@stageguide.com',
    description: 'Adresse email unique de l utilisateur',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password1',
    minLength: 8,
    description:
      'Mot de passe avec au moins 8 caracteres, une majuscule et un chiffre',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Le mot de passe doit contenir au moins 8 caracteres, une majuscule et un chiffre',
  })
  password!: string;

  @ApiProperty({
    example: 'Password1',
    minLength: 8,
    description: 'Confirmation du mot de passe, identique au champ password',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Les informations saisies sont invalides',
  })
  @Match<RegisterDto>('password', {
    message: 'Les informations saisies sont invalides',
  })
  confirmPassword!: string;

  @ApiProperty({
    example: 'Jean',
    description: 'Prenom de l utilisateur',
  })
  @IsString()
  @MinLength(1)
  prenom!: string;

  @ApiProperty({
    example: 'Dupont',
    description: 'Nom de famille de l utilisateur',
  })
  @IsString()
  @MinLength(1)
  nom!: string;

  @ApiProperty({
    example: '+33 6 12 34 56 78',
    required: false,
    description: 'Numero de telephone de l utilisateur',
  })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({
    example: 'Universite de Douala',
    required: false,
    description: 'Ecole du stagiaire',
  })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.STAGIAIRE)
  @IsOptional()
  @IsString()
  ecole?: string;

  @ApiProperty({
    example: 'Licence 3',
    required: true,
    description: 'Niveau d etudes du stagiaire',
  })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.STAGIAIRE)
  @IsString()
  @MinLength(1)
  niveauEtudes?: string;

  @ApiProperty({
    example: 'StageGuide',
    required: false,
    description: 'Entreprise du mentor ou de l utilisateur ENTREPRISE',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  entreprise?: string;

  @ApiProperty({
    example: 'Developpeur senior',
    required: false,
    description: 'Poste du mentor ou du contact entreprise',
  })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.MENTOR)
  @IsOptional()
  @IsString()
  poste?: string;

  @ApiProperty({
    example: 'J accompagne les stagiaires en developpement web.',
    required: false,
    description: 'Courte biographie du mentor',
  })
  @ValidateIf((dto: RegisterDto) => dto.role === UserRole.MENTOR)
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.STAGIAIRE,
    description: 'Role fonctionnel de l utilisateur dans la plateforme',
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    example: true,
    description:
      'Doit etre a true pour accepter les conditions d utilisation et la politique de confidentialite',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @Equals(true, {
    message:
      'Vous devez accepter les conditions d utilisation et la politique de confidentialite',
  })
  consentGiven!: boolean;
}
