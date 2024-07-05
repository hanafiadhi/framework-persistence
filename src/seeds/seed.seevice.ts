import { User, UserDocument } from '../app/schema/app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HashingService } from '../hashing.service';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

export class SeedService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly hashingService: HashingService,
  ) {}
  private readonly logger = new Logger();

  async seed() {
    try {
      const user: Partial<User> = {
        username: 'root',
        password: 'root',
        role: ['root', 'admin'],
        applications: ['webiste', 'dashboard', 'mobile'],
        tenant_id: 'pdp00001',
      };
      user.password = await this.hashingService.hash(user.password);
      const findUser = await this.userModel.findOne({
        username: 'root',
        isDeleted: false,
      });

      if (findUser) {
        throw new Error('User sudah dibuat');
      }
      await this.userModel.create(user).catch((err) => this.logger.error(err));
    } catch (error) {
      this.logger.error(error);
    }
  }
}
