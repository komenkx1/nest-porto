import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();

@Module({
  controllers: [AuthController],
  providers: [UserService],
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: `${configService.get<string>('TOKEN_EXPIRED')}s` || '60s',
      },
    }),
  ],
})
export class AuthModule {}
