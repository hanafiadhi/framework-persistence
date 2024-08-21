import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

import { WhatsAppClientService } from '../use-case/whatsapp-statelles.case';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsAppService implements WhatsAppClientService {
  constructor(
    @Inject('WHATSAPP') private readonly whatsappService: ClientProxy,
  ) {}
  async sendOTP(payload: {
    session?: string;
    phone: string;
    message: string;
  }): Promise<any> {
    return await firstValueFrom(
      this.whatsappService.emit('send-notif-otp', payload),
    );
  }
}
