import { Module } from '@nestjs/common';
import { AdminPartnerModule } from './partner/partner.module';
import { AdminUserModule } from './user/user.module';

@Module({
  imports: [AdminUserModule, AdminPartnerModule],
})
export class AdminModule {}
