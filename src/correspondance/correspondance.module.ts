import { Module } from '@nestjs/common';
import { CorrespondanceController } from './correspondance.controller';
import { CorrespondanceService } from './correspondance.service';

@Module({
  controllers: [CorrespondanceController],
  providers: [CorrespondanceService],
})
export class CorrespondanceModule {}
