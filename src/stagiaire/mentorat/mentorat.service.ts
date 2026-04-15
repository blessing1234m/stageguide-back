import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreerDemandeMentoratDto } from './dto/creer-demande-mentorat.dto';

@Injectable()
export class MentoratStagiaireService {
  async listerDemandes(stagiaireId: string) {
    return {
      stagiaireId,
      mentor: {
        name: null,
        title: null,
        company: null,
        avatar: null,
        bio: null,
        expertise: [],
        matchScore: null,
      },
      timeline: [
        { label: 'Demande envoyee', date: '2026-01-10', done: true },
        { label: 'Apparie', date: '2026-01-12', done: true },
        { label: 'Actif', date: '2026-01-15', done: true },
        { label: 'Evaluation finale', date: 'En cours', done: false },
      ],
      demandes: [],
      goals: [],
      sessions: [],
      evaluation: null,
    };
  }

  async creerDemande(stagiaireId: string, donnees: CreerDemandeMentoratDto) {
    return {
      id: randomUUID(),
      stagiaireId,
      statut: 'EN_ATTENTE',
      ...donnees,
      message: 'Demande de mentorat creee avec succes',
    };
  }
}
