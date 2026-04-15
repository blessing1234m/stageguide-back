import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreerConventionDto } from './dto/creer-convention.dto';

@Injectable()
export class ConventionsService {
  async lister(stagiaireId: string) {
    return {
      stagiaireId,
      conventions: [],
    };
  }

  async creer(stagiaireId: string, donnees: CreerConventionDto) {
    return {
      id: randomUUID(),
      stagiaireId,
      statut: 'BROUILLON',
      entrepriseNom: donnees.entrepriseNom,
      mentorNom: donnees.mentorNom ?? null,
      dateDebut: donnees.dateDebut ?? null,
      dateFin: donnees.dateFin ?? null,
      message: 'Convention creee avec succes',
    };
  }
}
