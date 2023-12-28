import { UserModule } from './user.module';

export const USER_ROUTER = [
  {
    path: 'user',
    module: UserModule,
    children: [],
  },
];
