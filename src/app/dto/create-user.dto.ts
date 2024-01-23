import { Types } from 'mongoose';

export class CreateUserDto {
  readonly name: string;
  readonly age: number;
  readonly province: Types.ObjectId;
  readonly province_name: string;
  readonly city: Types.ObjectId;
  readonly city_name: string;
  readonly district: Types.ObjectId;
  readonly district_name: string;
  readonly sub_district: Types.ObjectId;
  readonly sub_district_name: string;
}
