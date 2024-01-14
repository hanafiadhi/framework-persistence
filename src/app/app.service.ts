import { User, UserDocument } from './schema/app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ElasticsearchService } from '@nestjs/elasticsearch';

const getDataSource = (data: any) => {
  return data.hits.hits.map((value: any) => value._source);
};

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly esService: ElasticsearchService,
  ) {}

  async create(payload: any) {
    const create = await this.userModel.create(payload);

    // Menambahkan data di index users
    if (create) {
      payload.id = create._id;
      payload.created_at = new Date().toISOString();
      payload.updated_at = new Date().toISOString();

      await this.esService.index({
        index: 'users',
        document: payload,
      });
    }

    return create;
  }

  async getAll(payload: any) {
    const { page, perPage, name } = payload;

    let body = {
      query: {},
      _source: {
        excludes: ['id'],
      },
      from: (page - 1) * perPage,
      size: perPage,
    };

    if (name) {
      body.query = {
        match: {
          name,
        },
      };
    } else {
      body.query = {
        match_all: {},
      };
    }

    // Search data di index users
    const data = await this.esService.search({
      index: 'users',
      body,
    });

    const totalData = data.hits.total['value'];
    const totalPage = Math.ceil(totalData / perPage);

    return {
      totalPage,
      totalData,
      perPage: Number(perPage),
      currentPage: Number(page),
      data: getDataSource(data),
    };
  }

  async get(id: any) {
    const res = await this.esService.search({
      index: 'users',
      query: { match: { id } },
    });

    return getDataSource(res);
  }

  async delete(userId: string) {
    const deleteUser = await this.userModel.deleteOne({
      _id: userId,
    });

    // Hapus data di index users
    if (deleteUser) {
      this.esService.deleteByQuery({
        index: 'users',
        query: {
          match: {
            id: userId,
          },
        },
      });
    }

    return deleteUser;
  }

  async update(payload: any) {
    const { userId, data } = payload;

    const updateUser = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      data,
      { new: true },
    );

    // Update data di index users
    if (updateUser) {
      data.updated_at = new Date().toISOString();

      this.esService.updateByQuery({
        index: 'users',
        query: {
          term: {
            id: userId,
          },
        },
        script: {
          source: Object.entries(data)
            .map(([key, value]) => `ctx._source.${key} = '${value}'`)
            .join('; '),
          lang: 'painless',
        },
      });

      return updateUser;
    }
  }
}
