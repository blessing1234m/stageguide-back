import { Module } from '@nestjs/common';
import { OffresEmploiController } from './offres-emploi.controller';
import { OffresEmploiService } from './offres-emploi.service';

@Module({
  controllers: [OffresEmploiController],
  providers: [OffresEmploiService],
})
export class OffresEmploiModule {}
