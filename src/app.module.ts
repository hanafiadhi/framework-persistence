import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configs from 'src/common/configs';
import { RmqModule } from './providers/queue/rabbbitmq/rmq.module';
import { MongoDbModule } from './providers/database/mongodb/mongo.module';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './app/schema/app.schema';
import { HashingService } from './hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class AppModule {}
