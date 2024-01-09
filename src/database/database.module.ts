import { Module } from '@nestjs/common';
import { DatabaseOptionsService } from './database.option.service';

@Module({
  providers: [DatabaseOptionsService],
  exports: [DatabaseOptionsService],
  imports: [],
})
export class DatabaseModule {}
