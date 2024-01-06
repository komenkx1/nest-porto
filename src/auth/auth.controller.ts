import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
// Assuming you have a DTO for sign-in data

import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './auth.dto';
import { Public } from 'src/public.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @Public()
  async signIn(@Body() payload: SignInDto) {
    try {
      const user = await this.validateUser(payload.username, payload.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
      });

      return { access_token: accessToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByUsername({
        username: username,
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return null;
  }
}
