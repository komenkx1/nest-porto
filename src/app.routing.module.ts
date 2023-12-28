import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AUTH_ROUTER } from './auth/auth-routes';

const ROUTES = [...AUTH_ROUTER];

@Module({
  imports: [RouterModule.register(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
