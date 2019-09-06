import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Client as MinioClient, ClientOptions } from 'minio';
import { basename, extname } from 'path';

@Injectable()
export class FilesService {
  private s3Client: MinioClient;
  private hostUrl: string;

  constructor() {
    const config: ClientOptions = {
      endPoint: 'files.hop-market.tk',
      port: 9000,
      useSSL: false,
      accessKey: 'I18XOOU8Y6GESM4K2K4Q',
      secretKey: 'zdBflSvwYEuN6AuuYlmjFmL+ryOJnRyiKU90DEM6',
    };

    const { endPoint, port } = config;

    this.hostUrl = `http://${endPoint}:${port}/`;
    this.s3Client = new MinioClient(config);
  }

  public upload(
    bucket: string,
    filename: string,
    buffer: Buffer,
    mimetype?: string,
  ): string {
    const ext = extname(filename);
    const file = basename(filename, ext);

    const hash = crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex');

    const hashedFilename = `${file}-${hash}${ext}`;

    this.s3Client.putObject(bucket, hashedFilename, buffer, undefined, {
      'Content-Type': mimetype || 'text/plain',
    });

    return `${this.hostUrl}${bucket}/${hashedFilename}`;
  }
}
