import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import { RmqService } from '../../providers/queue/rabbbitmq/rmq.service';
import { ConfigService } from '@nestjs/config';
dotenv.config();

describe('RmqService', () => {
  let rmqService: RmqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RmqService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              return process.env[key];
            }),
          },
        },
      ],
    }).compile();

    rmqService = module.get<RmqService>(RmqService);
  });

  it('should be defined', () => {
    expect(rmqService).toBeDefined();
  });

  it('should get options for RabbitMQ', () => {
    const queueName = 'test_queue';
    const options = rmqService.getOptions(queueName);

    console.log(queueName);
    console.log(options);
  });
});
