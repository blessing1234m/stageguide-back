import { Module } from '@nestjs/common';
import { AdminPartnerController } from './partner.controller';
import { AdminPartnerService } from './partner.service';

@Module({
  controllers: [AdminPartnerController],
  providers: [AdminPartnerService],
  exports: [AdminPartnerService],
})
export class AdminPartnerModule {}
