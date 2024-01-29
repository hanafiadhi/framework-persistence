import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user-update.dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UserId } from './dto/user-id.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-user')
  async create(@Payload() createUserDto: CreateUserDto): Promise<User> {
    const create = await this.appService.create(createUserDto);
    console.log(create);
    return create;
  }

  @MessagePattern('find-user')
  async get(@Payload() id: UserId): Promise<User | null> {
    const user = await this.appService.get(id);
    console.log(user);
    return;
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
