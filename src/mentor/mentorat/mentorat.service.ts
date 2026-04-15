import { Injectable } from '@nestjs/common';
import { RepondreDemandeMentoratDto } from './dto/repondre-demande-mentorat.dto';

@Injectable()
export class MentoratMentorService {
  async listerDemandes(mentorId: string) {
    return {
      mentorId,
      demandes: [],
    };
  }

  async repondre(
    mentorId: string,
    demandeId: string,
    donnees: RepondreDemandeMentoratDto,
  ) {
    return {
      mentorId,
      demandeId,
      ...donnees,
      message: 'Decision enregistree avec succes',
    };
  }
}
