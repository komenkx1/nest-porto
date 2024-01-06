// import { AuthModule } from './auth.module';

import { AuthModule } from './auth.module';

export const AUTH_ROUTER = [
  {
    path: 'auth',
    module: AuthModule,
    children: [{ path: 'sign-in', method: 'post', action: 'signIn' }],
  },
];
