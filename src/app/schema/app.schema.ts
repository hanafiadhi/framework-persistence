import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';
import { IUserSchema } from 'src/common/interface/user.interface';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Schema({
  collection: 'user',
  strict: 'throw',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class User extends Document implements IUserSchema {
  @Prop({
    required: true,
    index: { partialFilterExpression: { isDeleted: false }, unique: true },
  })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ required: true, type: String })
  tenant_id: string;

  @Prop({ type: Array, required: true })
  role: string[];

  @Prop({ type: Array, required: true })
  applications: string[];

  @Prop({ type: Boolean, default: false })
  is_logged_in: boolean;

  @Prop({ type: Date, default: null })
  last_logged_in: Date;

  @Prop({ type: Date, default: null })
  last_logged_out: Date;

  @Prop({ type: String, default: null })
  last_ip_address: string;

  @Prop({ type: SchemaTypes.Mixed })
  last_logged_information?: {
    device_id?: string;
    device_brand?: string;
    device_model?: string;
    device_manufacture?: string;
    device_os?: string;
    device_os_version?: string;
  };

  @Prop({ default: null })
  confirmToken: string;

  @Prop({ default: null })
  verifiedAt: string;

  @Prop({ type: Boolean, default: false })
  is_active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema =
  SchemaFactory.createForClass(User).plugin(softDeletePlugin);
