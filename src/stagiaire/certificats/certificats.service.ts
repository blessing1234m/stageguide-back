import { Injectable } from '@nestjs/common';

@Injectable()
export class CertificatsService {
  async lister(utilisateurId: string) {
    return {
      utilisateurId,
      certificats: [],
    };
  }
}
