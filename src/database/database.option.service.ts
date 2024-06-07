import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class DatabaseOptionsService implements MongooseOptionsFactory {
  private readonly host: string;
  private readonly database: string;
  private readonly user: string;
  private readonly password: string;
  private readonly debug: boolean;
  private readonly options: string;
  private readonly env: string;

  constructor(private readonly configService: ConfigService) {
    this.env = this.configService.get<string>('APP_ENV');
    this.host = this.configService.get<string>('DATABASE_HOST');
    this.database = this.configService.get<string>('DATABASE_NAME');
    this.user = this.configService.get<string>('DATABASE_USER');
    this.password = this.configService.get<string>('DATABASE_PASSWORD');
    this.debug = this.configService.get<boolean>('DATABASE_DEBUG');
    this.options = this.configService.get<string>('DATABASE_OPTIONS');
  }

  createMongooseOptions(): MongooseModuleOptions {
    let uri = `mongodb://${this.host}`;

    if (this.user && this.password) {
      uri = `mongodb://${this.user}:${this.password}@${this.host}/${this.database}`;
    } else {
      uri = `mongodb://${this.host}/${this.database}`;
    }

    if (this.options) {
      uri += `?${this.options}`;
    }

    if (this.env !== 'prod') {
      mongoose.set('debug', this.debug);
    }

    const mongooseOptions: MongooseModuleOptions = {
      uri,
      serverSelectionTimeoutMS: 5000,
    };

    return mongooseOptions;
  }
}
