import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from './providers/queue/rabbbitmq/rmq.module';
import { MongoDbModule } from './providers/database/mongodb/mongo.module';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './app/schema/app.schema';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilter } from './common/filter/rpc-exeption.filter';
import { HashingService } from './hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { SeedService } from './seeds/seed.seevice';
import configs from './common/configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['env/.env'],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    RmqModule,
    MongoDbModule,
    AppModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    SeedService,
  ],
})
export class AppModule {}
