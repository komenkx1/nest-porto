import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): void => {
    v2.config({
      cloud_name: 'mangwahyu',
      api_key: '176385623622256',
      api_secret: 'nmGxbUlEc9mXM9Y8HvLVOrgkLus',
    });
  },
};
