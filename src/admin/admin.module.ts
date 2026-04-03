import { Module } from '@nestjs/common';
import { AdminPartnerController } from './partner/partner.controller';
import { AdminPartnerService } from './partner/partner.service';
import { AdminUserController } from './user/user.controller';
import { AdminUserService } from './user/user.service';

@Module({
  controllers: [AdminUserController, AdminPartnerController],
  providers: [AdminUserService, AdminPartnerService],
})
export class AdminModule {}
