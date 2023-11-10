import fs from "fs";
import path from "path";
import crypto from "crypto";

import FilesUtils from './utils/files';
import Config from './config';
import sequelize, { QueryTypes } from './utils/db';
import log from './utils/log';

const init = async () => {

  const pathKey = path.join(Config.path_base, '.key');

  const exists = await fs.promises.access(pathKey).then(() => true).catch(() => false)

  if(!exists) {

    log.info('Creating data directory...');

    await FilesUtils.mkdir(Config.path_base);
    log.info('Created data directory:', Config.path_base);

    await FilesUtils.mkdir(Config.tmp_base);
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

    await FilesUtils.mkdir(pathKey);
    log.info('Created key directory:', Config.path_base);

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    await fs.promises.writeFile(`${pathKey}/private-key.pem`, privateKey);
    await fs.promises.writeFile(`${pathKey}/public-key.pem`, publicKey);
    log.info('Created pair keys');

  } else {

    log.info('App already initialized');
  }
}

init();