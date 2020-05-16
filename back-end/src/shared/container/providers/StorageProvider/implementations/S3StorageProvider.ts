import fs from 'fs';
import path from 'path';
import mime from 'mime';
import uploadConfig from '@config/upload';
import aws, { S3 } from 'aws-sdk';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  public constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);
    const fileContent = await fs.promises.readFile(originalPath);

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error("It was not possible get the file's content type.");
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.S3.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();
    await fs.promises.unlink(originalPath);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.S3.bucket,
        Key: file,
      })
      .promise();
  }
}

export default DiskStorageProvider;
