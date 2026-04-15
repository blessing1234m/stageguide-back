import { Module } from '@nestjs/common';
import { CandidaturesModule } from './candidatures/candidatures.module';
import { CertificatsModule } from './certificats/certificats.module';
import { ConventionsModule } from './conventions/conventions.module';
import { FormationsModule } from './formations/formations.module';
import { MentoratStagiaireModule } from './mentorat/mentorat.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ProfilStagiaireModule } from './profil/profil.module';
import { TableauDeBordModule } from './tableau-de-bord/tableau-de-bord.module';

@Module({
  imports: [
    TableauDeBordModule,
    ProfilStagiaireModule,
    PortfolioModule,
    CandidaturesModule,
    MentoratStagiaireModule,
    ConventionsModule,
    FormationsModule,
    CertificatsModule,
  ],
})
export class StagiaireModule {}
