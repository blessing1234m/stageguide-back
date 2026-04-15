import { Injectable } from '@nestjs/common';

@Injectable()
export class FormationsService {
  async listerCatalogue() {
    return {
      formations: [],
    };
  }

  async listerMesFormations(utilisateurId: string) {
    return {
      utilisateurId,
      inscriptions: [],
    };
  }
}
