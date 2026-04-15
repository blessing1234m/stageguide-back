import { Module } from '@nestjs/common';
import { CertificatsController } from './certificats.controller';
import { CertificatsService } from './certificats.service';

@Module({
  controllers: [CertificatsController],
  providers: [CertificatsService],
})
export class CertificatsModule {}
