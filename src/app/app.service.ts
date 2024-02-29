import { User, UserDocument } from './schema/app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async create(payload: any) {
    try {
      return await this.userModel.create(payload);
    } catch (error) {
      throw new RpcException(
        new BadRequestException(
          `${Object.keys(error.keyPattern)} sudah digunakan`,
        ).getResponse(),
      );
    }
  }

  async get() {
    const payload = {
      province: '659bbe91a86d15f1e52d3060',
    };

    const res = await this.userModel.findOne(payload);
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

  async findEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findById(_id: string) {
    return await this.userModel.findById(_id);
  }

  async changePassword(_id: string, password: string) {
    return await this.userModel.findOneAndUpdate({ _id }, { password });
  }
}
