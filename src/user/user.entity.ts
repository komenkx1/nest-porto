import { Certificate } from 'src/certificate/certificate.entity';
import { Jargon } from 'src/jargon/jargon.enitity';
import { Portofolio } from 'src/portofolio/portofolio.entity';

export class User {
  id: number;
  name: string;
  username: string;
  is_active: boolean;
  password: string;
  description: string;
  title: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  jargon?: Jargon;
  portofolio?: Portofolio[];
  certificate?: Certificate[];
}
