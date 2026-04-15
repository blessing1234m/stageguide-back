import { Module } from '@nestjs/common';
import { ProfilMentorController } from './profil.controller';
import { ProfilMentorService } from './profil.service';

@Module({
  controllers: [ProfilMentorController],
  providers: [ProfilMentorService],
})
export class ProfilMentorModule {}
