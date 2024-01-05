import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppRoutingModule } from './app.routing.module';
import { DatabaseModule } from './database/database.module';
import { JargonModule } from './jargon/jargon.module';
import { UserModule } from './user/user.module';
import { PortofolioModule } from './portofolio/portofolio.module';
import { CertificateModule } from './certificate/certificate.module';
import { CategoryModule } from './category/category.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { TagModule } from './tag/tag.module';
import { PortofolioTagModule } from './portofolio_tag/portofolio_tag.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClodinaryService } from './clodinary/clodinary.service';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..'), // Sesuaikan dengan struktur direktori Anda
    // }),
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
    CloudinaryModule,
  ],
  controllers: [],
  providers: [ClodinaryService],
})
export class AppModule {}
