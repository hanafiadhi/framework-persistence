import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './providers/queue/rabbbitmq/rmq.service';
import { RmqOptions } from '@nestjs/microservices';
import * as chalk from 'chalk';

import { USER } from './common/constants/service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
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
  await app.startAllMicroservices();
  const warning = chalk.hex('#789461'); // Orange color
  console.log(`\n`);
  console.log(
    warning(
      `+================================================================================================================+`,
    ),
  );
  console.log(
    warning(`
      ███        ▄█    █▄     ▄█  ███▄▄▄▄      ▄█   ▄█▄    ▄████████      ████████▄     ▄████████  ▄█    █▄
  ▀█████████▄   ███    ███   ███  ███▀▀▀██▄   ███ ▄███▀   ███    ███      ███   ▀███   ███    ███ ███    ███
     ▀███▀▀██   ███    ███   ███▌ ███   ███   ███▐██▀     ███    █▀       ███    ███   ███    █▀  ███    ███
      ███   ▀  ▄███▄▄▄▄███▄▄ ███▌ ███   ███  ▄█████▀      ███             ███    ███  ▄███▄▄▄     ███    ███
      ███     ▀▀███▀▀▀▀███▀  ███▌ ███   ███ ▀▀█████▄    ▀███████████      ███    ███ ▀▀███▀▀▀     ███    ███
      ███       ███    ███   ███  ███   ███   ███▐██▄            ███      ███    ███   ███    █▄  ███    ███
      ███       ███    ███   ███  ███   ███   ███ ▀███▄    ▄█    ███      ███   ▄███   ███    ███ ███    ███
     ▄████▀     ███    █▀    █▀    ▀█   █▀    ███   ▀█▀  ▄████████▀       ████████▀    ██████████  ▀██████▀
                                        ▀
  `),
  );
  console.log(
    warning(
      `+================================================================================================================+`,
    ),
  );
  console.log(`\n`);
  console.log(chalk('APPLICATION'));
  console.log(
    '+----------------------------------------------------------------------------------------------------------------+',
  );

  console.log(chalk.blue(` NAME\t\t\t: ${appName}`));
  console.log(chalk.blue(` ENVIRONMENT\t\t: ${env}`));

  console.log(`\n`);
  console.log(chalk.green('DATABASE'));
  console.log(
    '+----------------------------------------------------------------------------------------------------------------+',
  );
  console.log(chalk.green(` URL\t\t\t: ${mongoUri}`));
  console.log(chalk.green(` NAME\t\t\t: ${dbName}`));
  console.log(chalk.green(` DEBUG\t\t\t: ${dbDebug}`));
  console.log(`\n`);

  console.log(chalk.yellow('RABBIT MQ'));
  console.log(
    '+----------------------------------------------------------------------------------------------------------------+',
  );
  console.log(chalk.yellow(` URL\t\t\t: ${rabbitMQ['server']['urls']}`));
  console.log(chalk.yellow(` QUEUE\t\t\t: ${USER.toLowerCase()}`));
  console.log(
    chalk.yellow(
      ` MESSAGE PATTERN\t: ${Array.from(
        rabbitMQ['server']['messageHandlers'].keys(),
      )}`,
    ),
  );
}
bootstrap();
