import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-user')
  async create(): Promise<any> {
    return this.appService.create();
  }
  @MessagePattern('get-user')
  async get(): Promise<any> {
    return this.appService.get();
  }
}
