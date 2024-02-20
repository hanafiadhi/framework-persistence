import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './providers/queue/rabbbitmq/rmq.service';
import { RmqOptions } from '@nestjs/microservices';
import * as chalk from 'chalk';

import { USER } from './common/constants/service';
import { ValidationPipe } from '@nestjs/common';
import { Console } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const env: string = configService.get<string>('app.appEnv');
  const appName: string = configService.get<string>('app.appName');
  const mongoUri: string = configService.get<string>('database.host');
  const dbName: string = configService.get<string>('database.name');
  const dbDebug: string = configService.get<string>('database.debug');
  const rmqService = app.get<RmqService>(RmqService);
  const rabbitMQ = app.connectMicroservice<RmqOptions>(
    rmqService.getOptions(USER, true),
  );
  const rmqMessagePattern = rabbitMQ['server']['messageHandlers'].keys();

  await app.startAllMicroservices();
  const error = chalk.bold.yellowBright;
  const warning = chalk.hex('#789461'); // Orange color

  console.log(
    warning(`
    ============================================================================================================

      ███        ▄█    █▄     ▄█  ███▄▄▄▄      ▄█   ▄█▄    ▄████████      ████████▄     ▄████████  ▄█    █▄
  ▀█████████▄   ███    ███   ███  ███▀▀▀██▄   ███ ▄███▀   ███    ███      ███   ▀███   ███    ███ ███    ███
     ▀███▀▀██   ███    ███   ███▌ ███   ███   ███▐██▀     ███    █▀       ███    ███   ███    █▀  ███    ███
      ███   ▀  ▄███▄▄▄▄███▄▄ ███▌ ███   ███  ▄█████▀      ███             ███    ███  ▄███▄▄▄     ███    ███
      ███     ▀▀███▀▀▀▀███▀  ███▌ ███   ███ ▀▀█████▄    ▀███████████      ███    ███ ▀▀███▀▀▀     ███    ███
      ███       ███    ███   ███  ███   ███   ███▐██▄            ███      ███    ███   ███    █▄  ███    ███
      ███       ███    ███   ███  ███   ███   ███ ▀███▄    ▄█    ███      ███   ▄███   ███    ███ ███    ███
     ▄████▀     ███    █▀    █▀    ▀█   █▀    ███   ▀█▀  ▄████████▀       ████████▀    ██████████  ▀██████▀
                                        ▀
    ============================================================================================================
  `),
  );
  console.log(`\n`);
  console.log('INFORMATION \t: ENV, QUEUE, MESSAGE PATTERN');

  console.log(
    '----------------------------------------------------------------------------------------------------------------',
  );
  console.log(`\n`);
  console.log(`APP NAME\t: ${appName}`);
  console.log(`APP ENVIRONMENT\t: ${env}`);

  console.log(`DATABASE URL\t: ${mongoUri}`);
  console.log(`DATABASE NAME\t: ${dbName}`);
  console.log(`DATABASE DEBUG\t: ${dbDebug}`);

  console.log(`QUEUE\t\t: ${USER}`);
  console.log(`MESSAGE PATTERN\t: ${Array.from(rmqMessagePattern)}`);
  console.log(`\n`);
}
bootstrap();
