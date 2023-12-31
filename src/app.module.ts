import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { CorsMiddleware } from './cors.middleware';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

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
    AuthModule,
  ],
  controllers: [],
  providers: [
    ClodinaryService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
