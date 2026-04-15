import { User } from '@prisma/client';

type SafeUser = Omit<User, 'passwordHash'>;

export function mapAuthUser(user: SafeUser) {
  return {
    id: user.id,
    email: user.email,
    role: user.role.toLowerCase(),
    prenom: user.prenom,
    nom: user.nom,
    telephone: user.telephone,
    bio: user.bio,
    entreprise: user.entreprise,
    poste: user.poste,
    ecole: user.ecole,
    niveauEtudes: user.niveauEtudes,
    first_name: user.prenom,
    last_name: user.nom,
    phone: user.telephone,
    avatar_url: null,
    is_active: user.isActive,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}
