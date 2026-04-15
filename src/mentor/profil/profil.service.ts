import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ModifierProfilMentorDto } from './dto/modifier-profil-mentor.dto';

@Injectable()
export class ProfilMentorService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfil(utilisateurId: string) {
    const utilisateur = await this.prisma.user.findFirst({
      where: {
        id: utilisateurId,
        deletedAt: null,
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        telephone: true,
        entreprise: true,
        poste: true,
        bio: true,
      },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return {
      utilisateurId: utilisateur.id,
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      telephone: utilisateur.telephone,
      entreprise: utilisateur.entreprise,
      poste: utilisateur.poste,
      bio: utilisateur.bio,
    };
  }

  async modifierProfil(utilisateurId: string, modification: ModifierProfilMentorDto) {
    const utilisateur = await this.prisma.user.update({
      where: { id: utilisateurId },
      data: {
        telephone: modification.telephone,
        entreprise: modification.entreprise,
        poste: modification.poste,
        bio: modification.bio,
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        telephone: true,
        entreprise: true,
        poste: true,
        bio: true,
      },
    });

    return {
      utilisateurId: utilisateur.id,
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      telephone: utilisateur.telephone,
      entreprise: utilisateur.entreprise,
      poste: utilisateur.poste,
      bio: utilisateur.bio,
      message: 'Profil mentor mis a jour avec succes',
    };
  }
}
