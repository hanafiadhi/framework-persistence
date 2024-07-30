import { User, UserDocument } from './schema/app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';

import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { HashingService } from '../hashing.service';
import { RpcException } from '@nestjs/microservices';
import { APIFeatures } from '../common/utils/apiFeatures';
import mongoose from 'mongoose';
import * as crypto from 'crypto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly hashingService: HashingService,
  ) {}

  async create(payload: any) {
    payload.password = await this.hashingService.hash(payload.password);
    try {
      const { _id, username, tenant_id, role, applications } =
        await this.userModel.create(payload);
      return { _id, username, tenant_id, role, applications };
    } catch (error) {
      if (error.code === 11000) {
        const duplicateKey = error.keyValue
          ? Object.keys(error.keyValue)[0]
          : '';
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${duplicateKey} sudah digunakan`,
        });
      }
    }
  }
  async findAll(queryString: any): Promise<any> {
    try {
      const features = new APIFeatures(this.userModel.find(), queryString)
        .filter()
        .sorting()
        .limitFields();

      const totalItems = await this.userModel.countDocuments(
        JSON.parse(features.filterData),
      );
      const result = await features.pagination();
      const reportData = {
        paging: {
          page: features.page,
          size: features.limit,
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / features.limit),
        },
        data: result,
      };

      return reportData;
    } catch (error) {
      if (error instanceof mongoose.Error) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Silahkan cek query anda`,
        });
      }

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Silahkan cek query anda`,
      }); // Re-throw the error for proper handling
    }
  }

  async get(payload: string) {
    return await this.userModel.findOne(
      { _id: payload },
      {
        username: 1,
        tenant_id: 1,
        role: 1,
        applications: 1,
      },
    );
  }

  async delete(userId: string) {
    const deleteUser = await this.userModel.softDelete({
      _id: userId,
    });
    return deleteUser;
  }

  async update(payload: any) {
    const data = payload.data;

    if (Object.keys(data).includes('password')) {
      data.password = await this.hashingService.hash(data.password);
    }
    try {
      const updateUser = await this.userModel.findOneAndUpdate(
        {
          _id: payload.userId,
        },
        data,
        {
          new: true,
        },
      );
      if (!updateUser) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `user dengan ID ${payload.userId} tidak di temukan`,
        });
      }
      return updateUser;
    } catch (error) {
      // mongoose.Error
      if (error.code === 11000) {
        const duplicateKey = error.keyValue
          ? Object.keys(error.keyValue)[0]
          : '';
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${duplicateKey} sudah digunakan`,
        });
      }
      throw error;
    }
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({
      username,
      isDeleted: false,
      applications: { $exists: true, $ne: null },
    });
  }

  async removeMany(payload: any) {
    return await this.userModel.deleteMany(payload);
  }

  async updateStatusMany(payload: any) {
    return await this.userModel.updateMany(
      {
        _id: { $in: payload.volunteer },
        isDeleted: false,
      },
      { $set: { is_active: payload.is_active } },
    );
  }

  generateVerificationCode(length = 4) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  async generateTokenOTP(payload) {
    const user = await this.userModel.findOne({ username: payload.whatsapp });

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `User dengan username ${payload.whatsapp} tidak di temukan`,
      });
    }
    if (user?.otp?.otp_banned >= new Date().getTime()) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Silahkan coba lagi setelah 10 menit',
      });
    }
    if (!payload.otp) {
      const otpQty = user?.otp?.otp_qty;
      if (otpQty > 0) {
        await this.userModel.findOneAndUpdate(
          { username: payload.whatsapp },
          {
            $inc: { 'otp.otp_qty': -1 },
            $set: {
              'otp.otp_token': this.generateVerificationCode(),
              'otp.otp_expired': new Date(
                new Date().getTime() + 1 * 60 * 1000,
              ).getTime(),
            },
          },
        );
        return {
          statusCode: HttpStatus.OK,
          message: 'berhasil generate code otp',
        };
      } else {
        const tenMinute = new Date(
          new Date().getTime() + 10 * 60 * 1000,
        ).getTime();
        await this.userModel.findOneAndUpdate(
          { username: payload.whatsapp },
          {
            $set: {
              'otp.otp_qty': 3,
              'otp.otp_expired': null,
              'otp.otp_token': null,
              'otp.otp_banned': tenMinute,
            },
          },
        );
        throw new RpcException({
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: {
            date_banned: tenMinute,
            banned: 'Silahkan coba lagi setelah 10 menit',
          },
        });
      }
    }

    if (user?.otp?.otp_expired <= new Date().getTime()) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'kode otp sudah expired',
      });
    }
    if (user?.otp?.otp_token != payload.otp) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'kode otp salah',
      });
    }
    return await this.userModel.findOneAndUpdate(
      { username: payload.whatsapp },
      {
        password: await this.hashingService.hash(payload.password),
        $set: {
          'otp.otp_qty': 3,
          'otp.otp_expired': null,
          'otp.otp_token': null,
          'otp.otp_banned': null,
        },
      },
    );
  }

  async generateTokenVefification(payload) {
    const user = await this.userModel.findOne({ username: payload.whatsapp });

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `User dengan username ${payload.whatsapp} tidak di temukan`,
      });
    }
    if (user?.verified?.verified_at !== null) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'user sudah di verifikasi',
      });
    }
    if (user?.verified?.verified_banned >= new Date().getTime()) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: {
          date_banned: user?.verified?.verified_banned,
          banned: 'Silahkan coba lagi',
        },
      });
    }
    if (!payload.token) {
      const verifiedQty = user?.verified?.verified_qty;
      if (verifiedQty > 0) {
        await this.userModel.findOneAndUpdate(
          { username: payload.whatsapp },
          {
            $inc: { 'verified.verified_qty': -1 },
            $set: {
              'verified.verified_token': this.generateVerificationCode(),
              'verified.verified_expired': new Date(
                new Date().getTime() + 1 * 60 * 1000,
              ).getTime(),
            },
          },
        );
        return {
          statusCode: HttpStatus.OK,
          message: 'berhasil generate code verifikasi',
        };
      } else {
        const now = new Date();
        let nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        await this.userModel.findOneAndUpdate(
          { username: payload.whatsapp },
          {
            $set: {
              'verified.verified_qty': 3,
              'verified.verified_expired': null,
              'verified.verified_token': null,
              'verified.verified_banned': nextDay.getTime(),
            },
          },
        );
        throw new RpcException({
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: {
            date_banned: nextDay.getTime(),
            banned: 'Silahkan coba lagi',
          },
        });
      }
    }

    if (user?.verified?.verified_expired <= new Date().getTime()) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'kode verifikasi sudah expired',
      });
    }
    if (user?.verified?.verified_token != payload.token) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'kode verifikasi salah',
      });
    }
    await this.userModel.findOneAndUpdate(
      { username: payload.whatsapp },
      {
        $set: {
          'verified.verified_qty': 0,
          'verified.verified_at': new Date().getTime(),
          'verified.verified_token': null,
          'verified.verified_expired': null,
          'verified.verified_banned': null,
        },
      },
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'berhasil generate code verifikasi',
    };
  }
}
