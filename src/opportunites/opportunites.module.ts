import { Module } from '@nestjs/common';
import { OffresEmploiModule } from './offres-emploi/offres-emploi.module';
import { OffresStageModule } from './offres-stage/offres-stage.module';

@Module({
  imports: [OffresStageModule, OffresEmploiModule],
})
export class OpportunitesModule {}
