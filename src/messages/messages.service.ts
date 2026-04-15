import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EnvoyerMessageDto } from './dto/envoyer-message.dto';

@Injectable()
export class MessagesService {
  async listerConversations(utilisateurId: string) {
    return {
      utilisateurId,
      conversations: [],
    };
  }

  async getConversation(utilisateurId: string, conversationId: string) {
    return {
      conversationId,
      utilisateurId,
      participants: [],
      messages: [],
    };
  }

  async envoyerMessage(
    utilisateurId: string,
    conversationId: string,
    donnees: EnvoyerMessageDto,
  ) {
    return {
      id: randomUUID(),
      conversationId,
      expediteurId: utilisateurId,
      contenu: donnees.contenu,
      creeLe: new Date(),
    };
  }
}
