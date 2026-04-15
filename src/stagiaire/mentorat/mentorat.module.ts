import { Module } from '@nestjs/common';
import { MentoratStagiaireController } from './mentorat.controller';
import { MentoratStagiaireService } from './mentorat.service';

@Module({
  controllers: [MentoratStagiaireController],
  providers: [MentoratStagiaireService],
})
export class MentoratStagiaireModule {}
