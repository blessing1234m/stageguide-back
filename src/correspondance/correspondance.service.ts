import { Injectable } from '@nestjs/common';

@Injectable()
export class CorrespondanceService {
  async proposerMentors(stagiaireId: string) {
    return {
      stagiaireId,
      suggestions: [],
    };
  }
}
