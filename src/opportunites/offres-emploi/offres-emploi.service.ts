import { Injectable } from '@nestjs/common';
import { ListerOffresEmploiDto } from './dto/lister-offres-emploi.dto';

@Injectable()
export class OffresEmploiService {
  async lister(filtres: ListerOffresEmploiDto) {
    return {
      filtres,
      offres: [],
    };
  }
}
