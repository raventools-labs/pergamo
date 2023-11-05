import fs from "fs";
import path from "path";

import FilesUtils from './utils/files';
import Config from './config';
import sequelize, { QueryTypes } from './utils/db';
import log from './utils/log';

const init = async () => {

  log.info('Creating data directory...');

  FilesUtils.mkdir(Config.path_base);
  log.info('Created data directory:', Config.path_base);

  FilesUtils.mkdir(Config.tmp_base);
  log.info('Created data temp directory:', Config.tmp_base);

  const script = fs.readFileSync(path.join(__dirname, 'config', 'init.sql')).toString();
  const transaction = await sequelize.transaction();

  try {

    await sequelize.query(script, { 
      transaction
    });

    log.info('Create database');

    await sequelize.query(
      `INSERT INTO pergamo.organization(id, name, password) 
      VALUES (:id, :name, crypt(:password, gen_salt('bf')))
      RETURNING *;`, {
      replacements: { 
        id: 'pergamo', 
        name: 'pergamo', 
        password: Config.password_master
      },
      transaction,
      type: QueryTypes.INSERT
    });

    log.info('Create first organization');
        transaction.commit();

  } catch(error:any) {

    log.error(`Fail to create database: ${error.message}`);

    await transaction.rollback();
  }
  
  // Add keys to data
}

init();