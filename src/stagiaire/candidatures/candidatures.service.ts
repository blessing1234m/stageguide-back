import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreerCandidatureDto } from './dto/creer-candidature.dto';

@Injectable()
export class CandidaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async lister(utilisateurId: string) {
    return this.prisma.candidature.findMany({
      where: { utilisateurId },
      include: {
        offreStage: {
          include: { partenaire: true },
        },
        offreEmploi: {
          include: { partenaire: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async creer(utilisateurId: string, donnees: CreerCandidatureDto) {
    const offreStageId = donnees.offreStageId?.trim() || null;
    const offreEmploiId = donnees.offreEmploiId?.trim() || null;

    if ((!offreStageId && !offreEmploiId) || (offreStageId && offreEmploiId)) {
      throw new BadRequestException('Veuillez fournir une seule offre de stage ou d emploi.');
    }

    const existing = await this.prisma.candidature.findFirst({
      where: {
        utilisateurId,
        offreStageId,
        offreEmploiId,
      },
    });

    if (existing) {
      throw new BadRequestException('Vous avez déjà postulé à cette offre.');
    }

    const offre = offreStageId
      ? await this.prisma.offreStage.findUnique({ where: { id: offreStageId } })
      : await this.prisma.offreEmploi.findUnique({ where: { id: offreEmploiId! } });

    if (!offre) {
      throw new NotFoundException('Offre introuvable.');
    }

    return this.prisma.candidature.create({
      data: {
        utilisateurId,
        offreStageId,
        offreEmploiId,
        message: donnees.message ?? null,
      },
      include: {
        utilisateur: true,
        offreStage: {
          include: { partenaire: true },
        },
        offreEmploi: {
          include: { partenaire: true },
        },
      },
    });
  }
}
