import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreerProjetDto } from './dto/creer-projet.dto';
import { ModifierProjetDto } from './dto/modifier-projet.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  private nettoyerTags(tags?: string[]): string[] {
    return (tags ?? [])
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  async listerProjets(utilisateurId: string) {
    const utilisateur = await this.prisma.user.findFirst({
      where: {
        id: utilisateurId,
        deletedAt: null,
      },
      select: {
        id: true,
        cv: {
          select: {
            titre: true,
            resume: true,
            formationResume: true,
            experienceResume: true,
          },
        },
        competences: {
          select: {
            niveau: true,
            competence: {
              select: {
                id: true,
                nom: true,
                categorie: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        projetsPortfolio: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return {
      utilisateurId: utilisateur.id,
      cv: {
        title: utilisateur.cv?.titre ?? null,
        summary: utilisateur.cv?.resume ?? null,
        education: utilisateur.cv?.formationResume ?? null,
        experience: utilisateur.cv?.experienceResume ?? null,
      },
      skills: utilisateur.competences.map((item) => ({
        id: item.competence.id,
        nom: item.competence.nom,
        categorie: item.competence.categorie,
        niveau: item.niveau,
      })),
      projets: utilisateur.projetsPortfolio,
    };
  }

  async creerProjet(utilisateurId: string, donnees: CreerProjetDto) {
    const projet = await this.prisma.projetPortfolio.create({
      data: {
        utilisateurId,
        titre: donnees.titre,
        description: donnees.description ?? null,
        tags: this.nettoyerTags(donnees.tags),
        imageUrl: donnees.imageUrl ?? null,
        lienProjet: donnees.lienProjet ?? null,
      },
    });

    return {
      ...projet,
      message: 'Projet cree avec succes',
    };
  }

  async modifierProjet(
    utilisateurId: string,
    projetId: string,
    donnees: ModifierProjetDto,
  ) {
    await this.verifierProjet(utilisateurId, projetId);

    const projet = await this.prisma.projetPortfolio.update({
      where: { id: projetId },
      data: {
        ...(donnees.titre !== undefined ? { titre: donnees.titre } : {}),
        ...(donnees.description !== undefined
          ? { description: donnees.description }
          : {}),
        ...(donnees.tags !== undefined
          ? { tags: this.nettoyerTags(donnees.tags) }
          : {}),
        ...(donnees.imageUrl !== undefined
          ? { imageUrl: donnees.imageUrl }
          : {}),
        ...(donnees.lienProjet !== undefined
          ? { lienProjet: donnees.lienProjet }
          : {}),
      },
    });

    return {
      ...projet,
      message: 'Projet mis a jour avec succes',
    };
  }

  async supprimerProjet(utilisateurId: string, projetId: string) {
    await this.verifierProjet(utilisateurId, projetId);

    const projet = await this.prisma.projetPortfolio.delete({
      where: { id: projetId },
    });

    return {
      id: projet.id,
      utilisateurId: projet.utilisateurId,
      message: 'Projet supprime avec succes',
    };
  }

  private async verifierProjet(utilisateurId: string, projetId: string) {
    const projet = await this.prisma.projetPortfolio.findFirst({
      where: {
        id: projetId,
        utilisateurId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    return projet;
  }
}
