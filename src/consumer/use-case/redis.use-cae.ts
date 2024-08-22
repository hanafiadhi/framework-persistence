import { Injectable } from '@nestjs/common';
import { PayloadRedis } from '../../common/interface/payload-redis.interface';

@Injectable()
export abstract class RedisClientService {
  abstract saveOrUpdateCache(payload: PayloadRedis): Promise<any>;
  abstract getCache({ key }: PayloadRedis): Promise<string | null>;
  abstract deleteCache({ key }: PayloadRedis): Promise<number>;
}
