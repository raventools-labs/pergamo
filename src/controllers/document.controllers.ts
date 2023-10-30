
import fs from "fs";
import mime from "mime-types";
import path from "path";
import mv from "mv";

import log from '../utils/log';
import Config from "../config";
import antivirus from "../utils/antivirus";
import { sha256 } from "../utils/hash";
import sequelize, { QueryTypes } from "../utils/db";
import Document from "../models/document.models";
import { ValidationError, StatusCodes } from "../middleware/error.middleware";

const upload = async (req, res, next) => {
  
  try {

    if(!req.file) throw new ValidationError(StatusCodes.BAD_REQUEST, 
        'FIELD_REQUIRED', 'Value "document" is required', req);
    
    const { file } = req;

    log.debug(`${req.method} ${req.originalUrl} - ${req.id} | Request file: ${JSON.stringify(file)}`);

    if(Config.enable_antivirus) {
      await antivirus.scan(file.path, req);
    }
    const metadata = {
      name: file.originalname,
      mimetype: file.mimetype,
      extension: mime.extension(file.mimetype),
      hash: await sha256(file.path)
    }

    const result = await sequelize.query("INSERT INTO PERGAMO.DOCUMENT(METADATA) VALUES (:metadata::jsonb) RETURNING *;", {
      replacements: { metadata: JSON.stringify(metadata) },
      type: QueryTypes.INSERT
    });

    const document:Document = result[0][0];

    log.debug(`${req.method} ${req.originalUrl} - ${req.id} | Document: ${JSON.stringify(document)}`);

    const filePath = path.join(Config.path_base, document.path);

    await mv(req.file.path, filePath, { mkdirp: true }, () => {});

    res.status(StatusCodes.OK)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(document.metadata));
  } catch (error) {
    if(req?.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
};

const getInfo = async (req:any) => {

  if(!req?.params?.id) throw new ValidationError(StatusCodes.BAD_REQUEST, 
    'FIELD_REQUIRED', 'Value "id" is required', req);

  const id = req.params.id;

  const result = await sequelize.query("SELECT path, metadata FROM pergamo.document WHERE id = :id;", {
    replacements: { id },
    type: QueryTypes.SELECT
  });

  if(result.length !== 1) throw new ValidationError(StatusCodes.NOT_FOUND, 
    'NO_CONTENT', `Document with id ${id} not exists`, req);

  const info:any = result[0];

  return info;
}

const getMetadata = async (req, res, next) => {
  
  try {

    const info = await getInfo(req);

    res.status(StatusCodes.OK)
      .set('Content-Type', 'application/json')
      .send(info.metadata);
  } catch (error) {
    next(error);
  }
};

const getFile = async (req, res, next) => {

  try {

    const info = await getInfo(req);

    const filePath = path.join(Config.path_base, info.path);
    
    res.setHeader('Content-Disposition', `attachment; filename=${info.metadata.name}`);
    res.status(StatusCodes.OK)
      .set('Content-Type', info.metadata.mimetype)
      .sendFile(filePath)
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {

  try {

    if(!req?.params?.id) throw new ValidationError(StatusCodes.BAD_REQUEST, 
      'FIELD_REQUIRED', 'Value "id" is required', req);

    const id = req.params.id;

    const result = await sequelize.query("DELETE FROM pergamo.document WHERE id = :id RETURNING path;", {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if(result.length !== 1) throw new ValidationError(StatusCodes.NOT_FOUND, 
      'NO_CONTENT', `Document with id ${id} not exists`, req);

    const info:any = result[0];

    if(Config.remove_file_disk) fs.unlinkSync(path.join(Config.path_base, info.path));
    
    res.status(StatusCodes.OK)
      .set('Content-Type', 'application/json')
      .send({ message: `Document with id ${id} deleted`});
  } catch (error) {
    next(error);
  }
};

export {
  upload,
  getMetadata,
  getFile,
  remove
}