import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  HydratedDocument,
  Types,
  Schema as schemaObject,
} from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { IUserSchema } from 'src/common/interface/user.interface';

@Schema({
  collection: 'user',
  strict: 'throw',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends Document implements IUserSchema {
  @Prop({
    required: true,
    index: { partialFilterExpression: { isDeleted: false }, unique: true },
  })
  name: string;

  @Prop({
    required: true,
    index: { partialFilterExpression: { isDeleted: false }, unique: true },
  })
  email: string;

  @Prop({
    required: true, //optional
    default: '',
  })
  password: string;

  @Prop({
    required: true, //optional
    default: 0,
  })
  age: number;

  @Prop({
    required: true, //optional
    default: 0,
  })
  province: schemaObject.Types.ObjectId;

  @Prop({
    required: true, //optional
    default: 0,
  })
  province_name: string;

  @Prop({
    required: true, //optional
    default: 0,
  })
  city: schemaObject.Types.ObjectId;

  @Prop({
    required: true, //optional
    default: 0,
  })
  city_name: string;

  @Prop({
    required: true, //optional
    default: 0,
  })
  district: schemaObject.Types.ObjectId;

  @Prop({
    required: true, //optional
    default: 0,
  })
  district_name: string;

  @Prop({
    required: true, //optional
    default: 0,
  })
  sub_district: schemaObject.Types.ObjectId;

  @Prop({
    required: true, //optional
    default: 0,
  })
  sub_district_name: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema =
  SchemaFactory.createForClass(User).plugin(softDeletePlugin);
