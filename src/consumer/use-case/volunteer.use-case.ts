import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class VolunteerClientService {
  abstract updateFlexsible(payload: object): Promise<any | Error>;
}
