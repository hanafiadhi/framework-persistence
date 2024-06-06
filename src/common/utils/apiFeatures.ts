export class APIFeatures {
  mongooseQuery: any;
  queryString: any;
  page: any;
  limit: any;
  filterData: any;
  constructor(mongooseQuery: any, queryString: any) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    // 1) Filtering
    const queryObj = { ...this.queryString };
    // console.log(1, queryObj);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((fields) => {
      delete queryObj[fields];
    });
    // console.log(2, queryObj);
    const or = {
      $or: [],
    };
    for (const key in queryObj) {
      if (queryObj[key] && queryObj[key]['regex']) {
        // { username: { regex: 'H', '$options': 'i' } }
        queryObj[key] = {
          $regex: `${queryObj[key]['regex']}`,
          $options: 'i',
        };
      }

      if (Object.keys(queryObj[key])[0] == 'in') {
        const splitevalue: string = String(Object.values(queryObj[key])[0]);
        queryObj[key] = {
          $in: splitevalue.split(','),
        };
      }

      if (Object.keys(queryObj[key])[0] == 'eq') {
        queryObj[key] = {
          $eq: Object.values(queryObj[key])[0],
        };
      }

      if (Object.keys(queryObj[key])[0] == 'ne') {
        queryObj[key] = {
          $ne: Object.values(queryObj[key])[0],
        };
      }

      if (Object.keys(queryObj[key])[0] == 'or') {
        or.$or.push({
          [key]: { $regex: Object.values(queryObj[key])[0], $options: 'i' },
        });
        delete queryObj[key];
      }
    }

    const string = JSON.stringify(queryObj);
    let parse = JSON.parse(string);
    if (or.$or.length !== 0) {
      parse = { ...parse, ...or };
    }

    this.mongooseQuery = this.mongooseQuery.find(parse);
    this.filterData = string;

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-created_at');
    }

    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }

    return this;
  }
  async pagination() {
    this.page = this.queryString.page * 1 || 1;

    this.limit = this.queryString.limit * 1 || 100;

    const skip = (this.page - 1) * this.limit;

    // this.mongooseQuery = await this.mongooseQuery.skip(skip).limit(this.limit);

    return await this.mongooseQuery.skip(skip).limit(this.limit);
  }
}
