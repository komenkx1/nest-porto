import { CertificateModule } from './certificate.module';

export const CERTIFICATE_ROUTER = [
  {
    path: 'certificate',
    module: CertificateModule,
    children: [],
  },
];
