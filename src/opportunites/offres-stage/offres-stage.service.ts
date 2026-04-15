import { Injectable } from '@nestjs/common';
import { ListerOffresStageDto } from './dto/lister-offres-stage.dto';

@Injectable()
export class OffresStageService {
  async lister(filtres: ListerOffresStageDto) {
    return {
      filtres,
      offres: [],
    };
  }
}
