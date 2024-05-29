import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
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
      let user: Partial<User> = {
        username: 'root',
        password: 'root',
        role: ['root', 'admin'],
        applications: ['webiste', 'dashboard', 'mobile'],
        tenant_id: 'PDP0001',
      };
      user.password = await this.hashingService.hash(user.password);
      let findUser = await this.userModel.find({ username: 'root' });
      if (findUser) {
        throw new Error('User sudah dibuat');
      }
      await this.userModel.create(user).catch((err) => console.log(err));
    } catch (error) {
      this.logger.error(error);
    }
  }
}
