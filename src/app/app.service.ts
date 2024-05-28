import { User, UserDocument } from './schema/app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { HashingService } from '../hashing.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly hashingService: HashingService,
  ) {}

  async create(payload: any) {
    payload.password = await this.hashingService.hash(payload.password);
    return this.userModel.create(payload);
  }

  async get() {
    const payload = {
      province: '659bbe91a86d15f1e52d3060',
    };

    const res = await this.userModel.findOne(payload);
    return res;
  }

  async delete(userId: string) {
    const deleteUser = await this.userModel.softDelete({
      _id: userId,
    });

    return deleteUser;
  }

  async update(payload: any) {
    const data = payload.data;
    const updateUser = await this.userModel.findOneAndUpdate(
      {
        _id: payload.userId,
      },
      data,
    );

    return updateUser;
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({
      username,
      isDeleted: false,
      applications: { $exists: true, $ne: null },
    });
  }
}
