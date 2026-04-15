import { Injectable } from '@nestjs/common';

@Injectable()
export class StagiairesService {
  async lister(mentorId: string) {
    return {
      mentorId,
      stagiaires: [],
    };
  }
}
