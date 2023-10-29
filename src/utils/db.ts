import { Sequelize, QueryTypes, DataTypes } from 'sequelize';
import pg from 'pg'
import Config from '../config';

export default new Sequelize({
  username: Config.db.username,
  password: Config.db.password,
  port: Config.db.port,
  host: Config.db.host,
  database: Config.db.name,
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  define: {
    timestamps: false,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    dialectModule: pg,
    connectTimeout: 35000,
    multipleStatements: true,
  }
})

export { QueryTypes, DataTypes };