import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-user')
  async create(@Payload() payload: any): Promise<any> {
    return this.appService.create(payload);
  }

  @MessagePattern('get-user-list')
  async getUserList(@Payload() query: any): Promise<any> {
    return this.appService.getAll(query);
  }

  @MessagePattern('get-user')
  async get(@Payload() query: any): Promise<any> {
    return this.appService.get(query);
  }

  @MessagePattern('delete-user')
  async delete(@Payload() userId: string): Promise<any> {
    return this.appService.delete(userId);
  }

  @MessagePattern('update-user')
  async update(@Payload() payload: any): Promise<any> {
    return this.appService.update(payload);
  }
}
