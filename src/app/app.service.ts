import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user-update.dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UserId } from './dto/user-id.dto';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(payload: CreateUserDto): Promise<User> {
    return this.databaseService.user.create({
      data: payload,
      include: { social_media: true },
    });
  }

  async get(id: UserId): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { id },
      include: { social_media: true },
    });
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
