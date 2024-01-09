import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  HydratedDocument,
  Types,
  Schema as schemaObject,
} from 'mongoose';
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
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  province: schemaObject.Types.ObjectId;

  @Prop()
  province_name: string;

  @Prop()
  city: schemaObject.Types.ObjectId;

  @Prop()
  city_name: string;

  @Prop()
  district: schemaObject.Types.ObjectId;

  @Prop()
  district_name: string;

  @Prop()
  sub_district: schemaObject.Types.ObjectId;

  @Prop()
  sub_district_name: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
