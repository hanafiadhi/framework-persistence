import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { USER } from 'src/common/constants/service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-user')
  async create(@Payload() payload:any): Promise<any> {
    return this.appService.create(payload);
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
  async update(@Payload() payload:any) {
    return this.appService.update(payload);
  }
}
