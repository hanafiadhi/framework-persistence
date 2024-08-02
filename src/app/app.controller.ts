import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user-per')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-user')
  async create(@Payload() payload: any): Promise<any> {
    return this.appService.create(payload);
  }

  @MessagePattern('get-user-list')
  async getUserList(@Payload() payload: any) {
    return this.appService.findAll(payload);
  }

  @MessagePattern('get-user')
  async getOne(@Payload() payload: string): Promise<any> {
    return this.appService.get(payload);
  }

  @MessagePattern('delete-user')
  async delete(@Payload() userId: string) {
    return this.appService.delete(userId);
  }

  @MessagePattern('delete-user-many')
  async deleteMany(@Payload() payload: object) {
    if (Object.keys(payload).length === 0) {
      throw new Error('payload kosong');
    }
    return this.appService.removeMany(payload);
  }

  @MessagePattern('update-user')
  async update(@Payload() payload: any) {
    return this.appService.update(payload);
  }

  @MessagePattern('update-status-user')
  async updateStatus(@Payload() payload: any) {
    return this.appService.updateStatusMany(payload);
  }

  @MessagePattern('find-by-username')
  async findByEmail(@Payload() payload: any) {
    return this.appService.findByUsername(payload);
  }

  @MessagePattern('forget-password')
  async forgetPassword(@Payload() payload: any) {
    return await this.appService.generateTokenOTP(payload);
  }

  @MessagePattern('register-mobile')
  async registerMobile(@Payload() payload: any) {
    return await this.appService.generateTokenVefification(payload);
  }

  @MessagePattern('health-check')
  async nice(@Payload() data: any) {
    return data;
  }
}
