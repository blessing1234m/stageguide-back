import { Module } from '@nestjs/common';
import { MentoratMentorModule } from './mentorat/mentorat.module';
import { ProfilMentorModule } from './profil/profil.module';
import { StagiairesModule } from './stagiaires/stagiaires.module';

@Module({
  imports: [ProfilMentorModule, StagiairesModule, MentoratMentorModule],
})
export class MentorModule {}
