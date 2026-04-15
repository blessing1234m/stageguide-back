import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async lister(utilisateurId: string) {
    return {
      utilisateurId,
      notifications: [
        {
          id: 'notification-1',
          titre: 'Nouvelle offre de stage',
          message: 'Une offre correspond a votre profil.',
          estLue: false,
          createdAt: new Date(),
        },
      ],
    };
  }
}
