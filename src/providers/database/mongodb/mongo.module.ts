import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseOptionsService } from '../../../database/database.option.service';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [DatabaseOptionsService],
      imports: [DatabaseModule],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createMongooseOptions(),
    }),
  ],
})
export class MongoDbModule {}
