import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { parse } from 'url';
import * as path from 'path';
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'default_folder',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(imageUrl: string, folder: string): Promise<any> {
    const parsedUrl = parse(imageUrl);
    const pathNameFormat = path.basename(
      parsedUrl.pathname || '',
      path.extname(parsedUrl.pathname || ''),
    ); // Hilangkan karakter '/' di awal
    const public_id = folder + '/' + pathNameFormat;
    console.log('public_id', public_id);
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(public_id, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
