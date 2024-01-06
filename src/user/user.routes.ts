import { UserModule } from './user.module';

export const USER_ROUTER = [
  {
    path: 'user',
    module: UserModule,
    children: [
      { path: 'set-active-user/:id', method: 'post', action: 'setActiveUser' },
      { path: 'jargon/:id', method: 'post', action: 'jargon' },
    ],
  },
];
