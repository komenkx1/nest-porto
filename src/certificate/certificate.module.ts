import { Module } from '@nestjs/common';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';

@Module({
  providers: [CertificateService],
  controllers: [CertificateController],
})
export class CertificateModule {}
