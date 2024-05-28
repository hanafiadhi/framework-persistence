import { Injectable } from '@nestjs/common';
import { HashingService } from '../hashing.service';
import * as argon2 from 'argon2';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    return await argon2.hash(data);
  }
  async compare(encrypted: string, password: string): Promise<boolean> {
    try {
      if (await argon2.verify(encrypted, password)) {
        // password match
        return true;
      } else {
        // password did not match
        return false;
      }
    } catch (err) {
      // internal failure
    }
  }
}
