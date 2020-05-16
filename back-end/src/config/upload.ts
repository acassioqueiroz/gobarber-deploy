import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'S3' | 'disk';
  tmpFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {
      uploadFolder: string;
      baseURL: string;
    };
    S3: {
      bucket: string;
      baseURL: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;
        return callback(null, fileName);
      },
    }),
  },
  config: {
    S3: {
      bucket: 'app-gobarber-bucket',
      baseURL: 'https://app-gobarber-bucket.s3.amazonaws.com',
    },
    disk: {
      uploadFolder: path.resolve(tmpFolder, 'uploads'),
      baseURL: `${process.env.APP_API_URL}/files`,
    },
  },
} as IUploadConfig;
