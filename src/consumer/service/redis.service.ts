import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { RedisClientService } from '../use-case/redis.use-cae';
import { PayloadRedis } from '../../common/interface/payload-redis.interface';
import { firstValueFrom } from 'rxjs';
import { RedisJWT } from '../../common/message-pattern/redis-client.pattern';

@Injectable()
export class RedisService implements RedisClientService {
  constructor(@Inject('REDIS') private readonly redisClient: ClientProxy) {}
  async saveOrUpdateCache(payload: PayloadRedis): Promise<any> {
    return await firstValueFrom(
      this.redisClient.emit(RedisJWT.SAVEORUPDATE, payload),
    );
  }
  async getCache({ key }: PayloadRedis): Promise<string> {
    return await firstValueFrom(
      this.redisClient.send(RedisJWT.GETONE, { key }),
    );
  }
  async deleteCache({ key }: PayloadRedis): Promise<number> {
    return await firstValueFrom(
      this.redisClient.emit(RedisJWT.REMOVE, { key }),
    );
  }
}
