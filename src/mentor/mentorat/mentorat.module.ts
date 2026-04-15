import { Module } from '@nestjs/common';
import { MentoratMentorController } from './mentorat.controller';
import { MentoratMentorService } from './mentorat.service';

@Module({
  controllers: [MentoratMentorController],
  providers: [MentoratMentorService],
})
export class MentoratMentorModule {}
