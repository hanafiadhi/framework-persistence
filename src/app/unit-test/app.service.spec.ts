import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';
import { Model, Types } from 'mongoose';
import { User, UserSchema } from '../schema/app.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

describe('AppService', () => {
  let appService: AppService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/testing'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('find all', () => {
    it('should find all user', async () => {
      const result = await appService.findAll();
      expect(result).toHaveLength(2);
    });
  });

  describe('find one', () => {
    it('should find one user with name', async () => {
      const getAllUser = await appService.findAll();
      const _id = getAllUser[0]._id;

      const result = await appService.findOne(_id);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('name', 'Galih Prambanan');
    });

    it('should return null if user not found', async () => {
      const result = await appService.findOne('65a3868d22d5c1b0d858d000');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    afterEach(async () => {
      await userModel.findOneAndDelete({ name: 'Rifki Ari' });
    });

    it('should create new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Rifki Ari',
        age: 21,
        province: new Types.ObjectId('65a3868d22d5c1b0d858d891'),
        province_name: 'Jawa Barat',
        city: new Types.ObjectId('65a3868d22d5c1b0d858d892'),
        city_name: 'Bekasi',
        district: new Types.ObjectId('65a3868d22d5c1b0d858d893'),
        district_name: 'Cibitung',
        sub_district: new Types.ObjectId('65a3868d22d5c1b0d858d89a'),
        sub_district_name: 'Wanasari',
      };

      const create = await appService.create(createUserDto);

      expect(create).not.toBeNull();
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await userModel.create({
        name: 'Rifki Ari',
        age: 21,
        province: new Types.ObjectId('65a3868d22d5c1b0d858d891'),
        province_name: 'Jawa Barat',
        city: new Types.ObjectId('65a3868d22d5c1b0d858d892'),
        city_name: 'Bekasi',
        district: new Types.ObjectId('65a3868d22d5c1b0d858d893'),
        district_name: 'Cibitung',
        sub_district: new Types.ObjectId('65a3868d22d5c1b0d858d89a'),
        sub_district_name: 'Wanasari',
      });
    });

    afterEach(async () => {
      await userModel.findOneAndDelete({ name: 'Ucok Ramadhan' });
    });

    it('should can update user with id', async () => {
      const user = await appService.findOneByName('Rifki Ari');
      const body = { name: 'Ucok Ramadhan', age: 44 };

      const updateUser = await appService.update(user._id, body);

      expect(updateUser).toHaveProperty('name', 'Ucok Ramadhan');
      expect(updateUser).toHaveProperty('age', 44);
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await userModel.create({
        name: 'Rifki Ari',
        age: 21,
        province: new Types.ObjectId('65a3868d22d5c1b0d858d891'),
        province_name: 'Jawa Barat',
        city: new Types.ObjectId('65a3868d22d5c1b0d858d892'),
        city_name: 'Bekasi',
        district: new Types.ObjectId('65a3868d22d5c1b0d858d893'),
        district_name: 'Cibitung',
        sub_district: new Types.ObjectId('65a3868d22d5c1b0d858d89a'),
        sub_district_name: 'Wanasari',
      });
    });

    it('should can delete user by id', async () => {
      const user = await userModel.findOne({ name: 'Rifki Ari' });
      const deleteUser = await appService.delete(user._id);
      const getUser = await appService.findOne(user._id);

      expect(deleteUser).toBeTruthy();
      expect(getUser).toBeNull();
    });
  });
});
