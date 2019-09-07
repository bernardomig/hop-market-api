import {
  Controller,
  Post,
  Body,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import {
  ApiConsumes,
  ApiModelProperty,
  ApiOperation,
  ApiImplicitFile,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';

class QrCodeReq {
  @ApiModelProperty({ description: 'the data to be encoded' })
  data: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly qrCodeService: QrcodeService,
    private readonly filesService: FilesService,
  ) {}

  @Post('qr')
  async getQrCode(@Body() body: QrCodeReq): Promise<string> {
    const { data } = body;

    return this.qrCodeService.encode(data);
  }

  @ApiOperation({ title: 'Uploads photos' })
  @ApiImplicitFile({ name: 'files', description: 'photos to be upload' })
  @ApiConsumes('multipart/form-data')
  @Post('photos')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPhoto(@UploadedFiles() files: any[]): Promise<string[]> {
    console.log(files);

    if (!files) {
      return [];
    }

    return files.map(({ originalname, buffer, mimetype }) => {
      return this.filesService.upload('images', originalname, buffer, mimetype);
    });
  }
}
