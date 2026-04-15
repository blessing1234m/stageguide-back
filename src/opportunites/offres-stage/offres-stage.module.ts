import { Module } from '@nestjs/common';
import { OffresStageController } from './offres-stage.controller';
import { OffresStageService } from './offres-stage.service';

@Module({
  controllers: [OffresStageController],
  providers: [OffresStageService],
})
export class OffresStageModule {}
