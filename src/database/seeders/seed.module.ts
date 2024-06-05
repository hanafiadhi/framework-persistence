import { Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { MenuSeed } from './menu.seed';

@Module({
  imports: [AppModule],
  providers: [MenuSeed],
  exports: [],
})
export class SeedModule {}
