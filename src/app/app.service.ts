import { User, UserDocument } from './schema/app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(payload: any) {
    return this.userModel.create(payload);
  }

  async get(_id: string) {
    const res = await this.userModel.findOne({ _id });
    return res;
  }

  async delete(userId: string) {
    const deleteUser = await this.userModel.findOneAndDelete({
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
}
