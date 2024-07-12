import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AppController } from '../src/app/app.controller';
import { AppService } from '../src/app/app.service';
import mongoose from 'mongoose';

describe('UserController', () => {
  let app: INestApplication;
  let userController: AppController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userController = moduleFixture.get<AppController>(AppController);
    await app.init();
  });

  it('should be defined userController', () => {
    expect(userController).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });
});

describe('UserService', () => {
  let app: INestApplication;
  let userService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<AppService>(AppService);
    await app.init();
  });

  it('should be defined userService', () => {
    expect(userService).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });
});
