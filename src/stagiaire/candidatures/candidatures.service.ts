import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreerCandidatureDto } from './dto/creer-candidature.dto';

@Injectable()
export class CandidaturesService {
  async lister(utilisateurId: string) {
    return {
      utilisateurId,
      candidatures: [],
    };
  }

  async creer(utilisateurId: string, donnees: CreerCandidatureDto) {
    return {
      id: randomUUID(),
      utilisateurId,
      statut: 'EN_ATTENTE',
      ...donnees,
      message: 'Candidature creee avec succes',
    };
  }
}
