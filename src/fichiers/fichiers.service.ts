import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EnregistrerFichierDto } from './dto/enregistrer-fichier.dto';

@Injectable()
export class FichiersService {
  async lister(utilisateurId: string) {
    return {
      utilisateurId,
      conventions: [],
      fichiers: [],
    };
  }

  async enregistrer(utilisateurId: string, donnees: EnregistrerFichierDto) {
    return {
      id: randomUUID(),
      utilisateurId,
      nom: donnees.nom,
      typeMime: donnees.typeMime,
      url: donnees.url ?? null,
      typeDocument: donnees.typeDocument ?? 'AUTRE',
      tailleOctets: donnees.tailleOctets ?? null,
      message: 'Fichier enregistre avec succes',
    };
  }
}
