import { Injectable } from '@nestjs/common';

import * as QRCode from 'qrcode';

@Injectable()
export class QrcodeService {
  encode(data: string): string {
    const qr = QRCode.toDataURL(data);

    return qr as string;
  }
}
