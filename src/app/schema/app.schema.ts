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
    required: false,
    type: {
      verified_token: { type: String, default: null },
      verified_at: { type: String, default: null },
      verified_qty: { type: Number, default: 3 },
      verified_expired: { type: Number, default: null },
      verified_banned: { type: Number, default: null },
    },
    _id: false,
  })
  verified: {
    verified_token: string;
    verified_at: string;
    verified_qty: number;
    verified_expired: number;
    verified_banned: number;
  };

  @Prop({
    required: false,
    type: {
      otp_token: { type: String, default: null },
      otp_qty: { type: Number, default: 3 },
      otp_expired: { type: Number, default: null },
      otp_banned: { type: Number, default: null },
    },
    _id: false,
  })
  otp: {
    otp_token: string;
    otp_expired: number;
    otp_banned: number;
    otp_qty: number;
  };

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

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User)
  .plugin(softDeletePlugin)
  .pre('save', function (next) {
    if (!this.verified && !this.otp) {
      this['verified'] = {
        verified_token: null,
        verified_at: null,
        verified_qty: 3,
        verified_expired: null,
        verified_banned: null,
      };
      this.otp = {
        otp_token: null,
        otp_expired: null,
        otp_banned: null,
        otp_qty: 3,
      };
    }

    next();
  })
  .post('find', function (docs) {
    docs.forEach((doc) => {
      if (!doc.last_logged_information) {
        doc.last_logged_information = {
          device_id: null,
          device_brand: null,
          device_model: null,
          device_manufacture: null,
          device_os: null,
          device_os_version: null,
        };
      }
    });
  });
