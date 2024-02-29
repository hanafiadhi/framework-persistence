import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('create-user')
  async create(@Payload() payload: any): Promise<any> {
    try {
      return await this.appService.create(payload);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('get-user-list')
  async getUserList() {}

  @MessagePattern('get-user')
  async get(): Promise<any> {
    return this.appService.get();
  }

  @MessagePattern('delete-user')
  async delete(@Payload() userId: string) {
    return this.appService.delete(userId);
  }

  @MessagePattern('update-user')
  async update(@Payload() payload: any) {
    return this.appService.update(payload);
  }

  @MessagePattern('mantab')
  async nice(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log({
      payload: data,
      ctx: context.getMessage(),
      pattern: context.getPattern(),
    });
  }
  @MessagePattern('find-by-email')
  async email(@Payload() email: any, @Ctx() context: RmqContext) {
    return await this.appService.findEmail(email);
  }

  @MessagePattern('find-by-id')
  async findById(@Payload() _id: string, @Ctx() context: RmqContext) {
    return await this.appService.findById(_id);
  }
  @MessagePattern('change-password')
  async changePassword(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);

    return await this.appService.changePassword(data._id, data.password);
  }
}
