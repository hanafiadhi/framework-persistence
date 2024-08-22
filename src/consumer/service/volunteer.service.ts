import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';
import { VolunteerClientService } from '../use-case/volunteer.use-case';
import { VolunteerMessagePattern } from '../../common/message-pattern/volunter-client';

@Injectable()
export class VolunterConsumer implements VolunteerClientService {
  constructor(
    @Inject('VOLUNTEER') private readonly volunteerClient: ClientProxy,
  ) {}
  async updateFlexsible(payload: object): Promise<any> {
    return await firstValueFrom(
      this.volunteerClient.emit(
        VolunteerMessagePattern.UPDATEFLEXIBLE,
        payload,
      ),
    );
  }
}
