import { Category } from 'src/category/category.entity';
import { PortofolioTag } from 'src/portofolio_tag/portofolio_tag.entity';
import { User } from 'src/user/user.entity';

export class Portofolio {
  id?: number;
  user_id?: number;
  category_id?: number;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  user?: User;
  category?: Category;
  portofolioTag?: PortofolioTag[];
}
