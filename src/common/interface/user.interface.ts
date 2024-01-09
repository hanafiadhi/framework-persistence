import { Schema } from 'mongoose';

export interface IUserSchema {
  name: string;
  age: number;
  province: Schema.Types.ObjectId;
  province_name: string;
  city: Schema.Types.ObjectId;
  city_name: string;
  district: Schema.Types.ObjectId;
  district_name: string;
  sub_district: Schema.Types.ObjectId;
  sub_district_name: string;
}
