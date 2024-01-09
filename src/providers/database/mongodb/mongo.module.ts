import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseOptionsService } from 'src/database/database.option.service';

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
