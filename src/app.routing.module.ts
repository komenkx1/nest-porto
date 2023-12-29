import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AUTH_ROUTER } from './auth/auth-routes';
import { USER_ROUTER } from './user/user.routes';
import { JARGON_ROUTER } from './jargon/jargon.routes';
import { CATEGORY_ROUTER } from './category/category.routes';
const ROUTES = [
  ...AUTH_ROUTER,
  ...USER_ROUTER,
  ...JARGON_ROUTER,
  ...CATEGORY_ROUTER,
];

@Module({
  imports: [RouterModule.register(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
