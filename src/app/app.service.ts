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

  async create() {
    const payload = {
      name: 'Rifki Ari',
      age: 21,
      province: '659bbe91a86d15f1e52d3060',
      province_name: 'Jawa',
      city: '659bbe91a86d15f1e52d3062',
      city_name: 'Bekasi',
      district: '659bbe91a86d15f1e52d3063',
      district_name: 'Cibitung',
      sub_district: '659bbe91a86d15f1e52d3060',
      sub_district_name: 'Wanasari',
    };
    return this.userModel.create(payload);
  }

  async get() {
    const payload = {
      province: '659bbe91a86d15f1e52d3060',
    };

    const res = await this.userModel.findOne(payload);
    return res;
  }
}
