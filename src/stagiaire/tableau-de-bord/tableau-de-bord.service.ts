import { Injectable } from '@nestjs/common';

@Injectable()
export class TableauDeBordService {
  async getVueEnsemble(utilisateurId: string) {
    return {
      utilisateurId,
      stats: [
        { label: 'Profil complete', value: '75%', trend: '+5%' },
        { label: 'Formations en cours', value: '3', trend: '+1' },
        { label: 'Candidatures', value: '8', trend: '+2' },
        { label: 'Certificats', value: '2', trend: '+1' },
      ],
      progressionProfil: {
        pourcentage: 75,
        etapes: [
          { label: 'Informations personnelles', done: true },
          { label: 'CV et competences', done: true },
          { label: 'Preferences de stage', done: true },
          { label: 'Photo de profil', done: false },
          { label: 'Portfolio et projets', done: false },
        ],
      },
      mentorSuggere: {
        name: null,
        title: null,
        expertise: [],
        matchScore: null,
      },
      formations: [],
      sessionsAVenir: [],
      activitesRecentes: [],
      messages: [],
    };
  }
}
