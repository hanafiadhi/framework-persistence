import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class WhatsAppClientService {
  abstract sendOTP(payload: {
    session?: string;
    phone: string;
    message: string;
  }): Promise<any>;
}
