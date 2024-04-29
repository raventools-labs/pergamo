import dotenv from 'dotenv';
import path from 'path';
import { Dialect } from 'sequelize';

dotenv.config();

const path_base = process.env.DIR_DATA ? process.env.DIR_DATA : path.join(__dirname, '..','..', 'data');
const valid_metadata_modify:string[] = process.env.VALID_METADATA_MODIFY ? 
  process.env.VALID_METADATA_MODIFY.split(';').map((value) => value.trim()) : [];
const valid_mimetype:string[] = process.env.VALID_MIMETYPE ? 
  process.env.VALID_MIMETYPE.split(';').map((value) => value.trim()) : [];

export default {
  path_base,
  tmp_base: path.join(path_base, 'tmp'),
  enable_antivirus: process.env.ENABLE_ANTIVIRUS === 'true' || false,
  debug: process.env.DEBUG === 'true' || false,
  remove_file_disk: process.env.REMOVE_FILE_DISK === 'true' || true,
  valid_metadata_modify,
  valid_mimetype,
  max_version_file: process.env.MAX_VERSION_FILES ? Number.parseInt(process.env.MAX_VERSION_FILES) : 1,
  port: process.env.PORT || 3000,
  user_master: process.env.USER_MASTER,
  password_master: process.env.PASSWORD_MASTER,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    name: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' || false,
    dialect: process.env.DB_DIALECT as Dialect || 'postgres' as Dialect
  }
}