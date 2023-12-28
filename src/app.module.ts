import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppRoutingModule } from './app.routing.module';
import { DatabaseModule } from './database/database.module';
import { JargonModule } from './jargon/jargon.module';
import { UserModule } from './user/user.module';
import { PortofolioModule } from './portofolio/portofolio.module';
import { CertificateModule } from './certificate/certificate.module';
import { CategoryModule } from './category/category.module';

import { TagModule } from './tag/tag.module';
import { PortofolioTagModule } from './portofolio_tag/portofolio_tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AppRoutingModule,
    JargonModule,
    PortofolioModule,
    CertificateModule,
    CategoryModule,
    TagModule,
    PortofolioTagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
