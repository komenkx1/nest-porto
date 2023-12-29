/* eslint-disable prettier/prettier */

import { User } from 'src/user/user.entity';

export class Jargon {
  id: number;
  user_id: number;
  primary_text: string;
  secondary_text: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  user?: User;
}
