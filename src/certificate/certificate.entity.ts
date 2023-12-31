import { User } from 'src/user/user.entity';

export class Certificate {
  id: number;
  user_id: number;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  user?: User;
}
