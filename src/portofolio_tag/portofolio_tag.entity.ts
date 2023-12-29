import { Portofolio } from 'src/portofolio/portofolio.entity';
import { Tag } from 'src/tag/tag.entity';

export class PortofolioTag {
  id: number;
  portofolio_id: number;
  tag_id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  portofolio?: Portofolio;
  tag?: Tag;
}
