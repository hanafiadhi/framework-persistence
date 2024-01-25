import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/user-update.dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UserId } from './dto/user-id.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-user')
  async create(@Payload() createUserDto: CreateUserDto): Promise<User> {
    return this.appService.create(createUserDto);
  }

  @MessagePattern('find-user')
  async get(@Payload() id: UserId): Promise<User | null> {
    return this.appService.get(id);
  }

  @MessagePattern('list-user')
  async list(): Promise<User[]> {
    return this.appService.list();
  }

  @MessagePattern('update-user')
  async update(@Payload() payload: UpdateUserDto): Promise<User | null> {
    return this.appService.update(payload);
  }

  @MessagePattern('remove-user')
  async remove(@Payload() id: UserId): Promise<User | null> {
    return this.appService.remove(id);
  }
}
