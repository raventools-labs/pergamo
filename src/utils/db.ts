import { Sequelize, QueryTypes, DataTypes } from 'sequelize';
import pg from 'pg'
import Config from '../config';

const configDatabase:any = {
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
    dialectModule: pg,
    connectTimeout: 35000,
    multipleStatements: true,
  }
}

if(Config.db.ssl) {
  configDatabase.dialectOptions.ssl = {
    require: Config.db.ssl,
    rejectUnauthorized: false
  }
}

export default new Sequelize(configDatabase)

export { QueryTypes, DataTypes };