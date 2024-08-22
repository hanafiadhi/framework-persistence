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
import { WhatsAppClientService } from './consumer/use-case/whatsapp-statelles.case';
import { WhatsAppService } from './consumer/service/whatsapp-statelles.service';
import { VolunteerClientService } from './consumer/use-case/volunteer.use-case';
import { VolunterConsumer } from './consumer/service/volunteer.service';
import { RedisClientService } from './consumer/use-case/redis.use-cae';
import { RedisService } from './consumer/service/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
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
    RmqModule.register({ name: 'WHATSAPP' }),
    RmqModule.register({ name: 'VOLUNTEER' }),
    RmqModule.register({ name: 'REDIS' }),
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
    { provide: WhatsAppClientService, useClass: WhatsAppService },
    { provide: VolunteerClientService, useClass: VolunterConsumer },
    { provide: RedisClientService, useClass: RedisService },
    SeedService,
  ],
})
export class AppModule {}
