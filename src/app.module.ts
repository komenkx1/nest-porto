import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppRoutingModule } from './app.routing.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AppRoutingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
