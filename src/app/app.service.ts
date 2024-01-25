import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user-update.dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UserId, UserIdDto } from './dto/user-id.dto';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(payload: CreateUserDto): Promise<User> {
    return this.databaseService.user.create({ data: payload });
  }

  async get(id: UserId): Promise<User | null> {
    return this.databaseService.user.findUnique({ where: { id } });
  }

  async list(): Promise<User[]> {
    return this.databaseService.user.findMany();
  }

  async update(payload: UpdateUserDto): Promise<User> {
    const { id, ...body } = payload;

    return this.databaseService.user.update({
      where: { id },
      data: { ...body },
    });
  }

  async remove(id: UserId): Promise<User | null> {
    return this.databaseService.user.delete({ where: { id } });
  }
}
