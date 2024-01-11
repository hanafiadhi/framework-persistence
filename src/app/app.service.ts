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

  async create(payload:any) {
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
    const deleteUser = await this.userModel.findOneAndDelete({
       _id: userId 
    });

    return deleteUser;
  }

  async update(payload:any) {
     const data = payload.data;
     const updateUser = await this.userModel.findOneAndUpdate({
       _id :payload.userId,
     }, data);

     return updateUser;
  }
}
