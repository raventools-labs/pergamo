import dotenv from 'dotenv';
import path from 'path';
import { Dialect } from 'sequelize';

dotenv.config();

const path_base = process.env.DIR_DATA ? process.env.DIR_DATA : path.join(__dirname, '..','..', 'data');

export default {
  path_base,
  tmp_base: path.join(path_base, 'tmp'),
  enable_antivirus: process.env.ENABLE_ANTIVIRUS === 'true' || false,
  port: process.env.PORT || 3000,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    name: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT as Dialect || 'postgres' as Dialect
  }
}