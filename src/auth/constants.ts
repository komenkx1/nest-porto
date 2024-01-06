// jwt.constants.ts
import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
  get secret() {
    const configService = new ConfigService();
    return configService.get<string>('JWT_SECRET') || '';
  },
};
