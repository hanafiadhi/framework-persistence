import { Test, TestingModule } from '@nestjs/testing';

import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { AppController } from '../src/app/app.controller';
import { AppService } from '../src/app/app.service';
import { User } from '../src/app/schema/app.schema';
import { HashingService } from '../src/hashing.service';
import mongoose from 'mongoose';
import { IUserSchema } from '../src/common/interface/user.interface';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteMany: jest.fn(),
    updateMany: jest.fn(),
    softDelete: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(() => ({
      filter: jest.fn().mockReturnThis(),
      sorting: jest.fn().mockReturnThis(),
      limitFields: jest.fn().mockReturnThis(),
      pagination: jest.fn(),
    })),
  };

  const mockHashingService = {
    hash: jest.fn((data: string) => Promise.resolve('hashed_' + data)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: HashingService, useValue: mockHashingService },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const payload = { username: 'test', password: 'testpassword' };
      const hashedPassword = 'hashedPassword';
      mockHashingService.hash.mockImplementation((data: string) =>
        Promise.resolve('hashed_' + data),
      );

      mockUserModel.create.mockResolvedValue({
        _id: 'someId',
        username: 'test',
        tenant_id: 'someTenantId',
        role: 'user',
        applications: [],
      });

      const result = await appController.create(payload);

      expect(mockHashingService.hash).toHaveBeenCalledWith('testpassword');
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashed_testpassword',
        }),
      );

      expect(result).toEqual({
        _id: 'someId',
        username: 'test',
        tenant_id: 'someTenantId',
        role: 'user',
        applications: [],
      });
    });

    it('should throw an RpcException if username already exists', async () => {
      const payload = { username: 'test', password: 'test123' };
      mockHashingService.hash.mockResolvedValue('hashedPassword');
      mockUserModel.create.mockRejectedValue({
        code: 11000,
        keyValue: { username: 'test' },
      });

      await expect(appController.create(payload)).rejects.toThrow(
        new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'username sudah digunakan',
        }),
      );
    });
  });

  describe('getUserList', () => {
    it('should find all community with pagination', async () => {
      // Mocking the APIFeatures class
      const mockFeatures = {
        filter: jest.fn().mockReturnThis(),
        sorting: jest.fn().mockReturnThis(),
        limitFields: jest.fn().mockReturnThis(),
        pagination: jest.fn().mockReturnThis(),
        filterData: '{}', // Example filterData, adjust as per your needs
        page: 1,
        limit: 10,
      };

      jest
        .spyOn(appService, 'findAll')
        .mockImplementation(async (queryString) => {
          const totalItems = 20;
          const result = await mockFeatures.pagination();
          const totalPages = Math.ceil(totalItems / mockFeatures.limit);
          return {
            paging: {
              page: mockFeatures.page,
              size: mockFeatures.limit,
              totalItems: totalItems,
              totalPages: totalPages !== Infinity ? totalPages : 0,
            },
            data: result,
          };
        });

      const queryString = {};
      const result = await appService.findAll(queryString);

      expect(result.paging.totalItems).toBe(20);
      expect(mockFeatures.pagination).toBeDefined();
    });

    it('should throw an RpcException if mongoose error occurs', async () => {
      const queryString = { page: 1, limit: 10 };

      mockUserModel.find.mockImplementation(() => {
        throw new mongoose.Error('Some mongoose error');
      });

      await expect(appService.findAll(queryString)).rejects.toThrow(
        RpcException,
      );
      await expect(appService.findAll(queryString)).rejects.toEqual(
        new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Silahkan cek query anda',
        }),
      );
    });
  });

  describe('getOne', () => {
    it('should return a user', async () => {
      const payload = 'someId';
      const mockResult = {
        username: 'test',
        tenant_id: 'someTenantId',
        role: 'user',
        applications: [],
      };
      mockUserModel.findOne.mockResolvedValue(mockResult);

      const result = await appController.getOne(payload);

      expect(result).toEqual(mockResult);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const userId = 'someId';
      const mockResult = { deleted: true };
      mockUserModel.softDelete.mockResolvedValue(mockResult);

      const result = await appController.delete(userId);

      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const payload = { userId: 'someId', data: { username: 'updated' } };
      const mockResult = {
        _id: 'someId',
        username: 'updated',
        tenant_id: 'someTenantId',
        role: 'user',
        applications: [],
      };
      mockUserModel.findOneAndUpdate.mockResolvedValue(mockResult);

      const result = await appController.update(payload);

      expect(result).toEqual(mockResult);
    });

    it('should throw an RpcException if user not found', async () => {
      const payload = { userId: 'someId', data: { username: 'updated' } };
      mockUserModel.findOneAndUpdate.mockResolvedValue(null);

      await expect(appController.update(payload)).rejects.toThrow(
        new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `user dengan ID ${payload.userId} tidak di temukan`,
        }),
      );
    });
  });

  describe('forgot-password', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should throw an error because user not found', async () => {
      mockUserModel.findOne.mockRejectedValue(
        new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `user dengan username root tidak di temukan`,
        }),
      );
      await expect(
        appService.generateTokenOTP({ whatsapp: 'root' }),
      ).rejects.toThrow(RpcException);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: 'root' });
    });

    it('should success generate token otp', async () => {
      const mockResult: Partial<IUserSchema> = {
        username: 'root',
        otp: {
          otp_banned: null,
          otp_expired: null,
          otp_qty: 3,
          otp_token: null,
        },
      };

      const mockUpdateResult: Partial<IUserSchema> = {
        username: 'root',
        otp: {
          otp_banned: null,
          otp_expired: new Date(new Date().getTime() + 1 * 60 * 1000).getTime(),
          otp_qty: 2,
          otp_token: '1231',
        },
      };

      mockUserModel.findOne.mockReturnValue(mockResult);
      mockUserModel.findOneAndUpdate.mockReturnValue(mockUpdateResult);

      await expect(
        appService.generateTokenOTP({ whatsapp: 'root' }),
      ).resolves.toEqual({
        statusCode: HttpStatus.OK,
        message: 'berhasil generate code otp',
      });

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: 'root' });

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { username: 'root' },
        {
          $inc: { 'otp.otp_qty': -1 },
          $set: {
            'otp.otp_token': expect.any(String),
            'otp.otp_expired': expect.any(Number),
          },
        },
      );
    });

    it('should failed generate token otp because otp_qty is zero and must be banned', async () => {
      const mockResult: Partial<IUserSchema> = {
        username: 'root',
        otp: {
          otp_banned: null,
          otp_expired: null,
          otp_qty: 0,
          otp_token: null,
        },
      };
      const mockUpdateResult: Partial<IUserSchema> = {
        username: 'root',
        otp: {
          otp_banned: new Date(new Date().getTime() + 10 * 60 * 1000).getTime(),
          otp_expired: null,
          otp_qty: 3,
          otp_token: null,
        },
      };
      mockUserModel.findOne.mockReturnValue(mockResult);
      mockUserModel.findOneAndUpdate.mockReturnValue(mockUpdateResult);

      await expect(
        appService.generateTokenOTP({ whatsapp: 'root' }),
      ).rejects.toThrow(
        new RpcException({
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: {
            date_banned: mockUpdateResult.otp.otp_banned,
            banned: 'Silahkan coba lagi setelah 10 menit',
          },
        }),
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: 'root' });

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { username: 'root' },
        {
          $set: {
            'otp.otp_qty': expect.any(Number),
            'otp.otp_expired': null,
            'otp.otp_token': null,
            'otp.otp_banned': expect.any(Number),
          },
        },
      );
    });

    it('should failed to generate token because still in banned time', async () => {
      const mockResult: Partial<IUserSchema> = {
        username: 'root',
        otp: {
          otp_banned: new Date(new Date().getTime() + 10 * 60 * 1000).getTime(),
          otp_expired: null,
          otp_qty: 3,
          otp_token: null,
        },
      };

      mockUserModel.findOne.mockReturnValue(mockResult);

      await expect(
        appService.generateTokenOTP({ whatsapp: 'root' }),
      ).rejects.toThrow(
        new RpcException({
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: 'Silahkan coba lagi setelah 10 menit',
        }),
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        username: 'root',
      });
    });
  });
});
