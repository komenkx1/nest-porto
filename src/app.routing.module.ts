import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AUTH_ROUTER } from './auth/auth-routes';
import { USER_ROUTER } from './user/user.routes';

const ROUTES = [...AUTH_ROUTER, ...USER_ROUTER];

@Module({
  imports: [RouterModule.register(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
