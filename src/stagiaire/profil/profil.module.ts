import { Module } from '@nestjs/common';
import { ProfilStagiaireController } from './profil.controller';
import { ProfilStagiaireService } from './profil.service';

@Module({
  controllers: [ProfilStagiaireController],
  providers: [ProfilStagiaireService],
})
export class ProfilStagiaireModule {}
