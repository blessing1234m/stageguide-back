import { Module } from '@nestjs/common';
import { AdminUserController } from './user.controller';
import { AdminUserService } from './user.service';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService],
  exports: [AdminUserService],
})
export class AdminUserModule {}
