
import fs from "fs";
import mime from "mime-types";
import path from "path";
import mv from "mv";

import Config from "../config";
import antivirus from "../utils/antivirus";
import { sha256 } from "../utils/hash";
import sequelize, { QueryTypes } from "../utils/db";
import Document from "../models/document.models";

const fileUpload = async (req, res, next) => {
  try {
    
    const { file } = req;

    if(Config.enable_antivirus) {
      await antivirus.scan(file.path);
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

    console.log(document);

    const filePath = path.join(Config.path_base, document.path);

    await mv(req.file.path, filePath, { mkdirp: true }, () => {});

    res.status(200)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ message: 'Todo bien'}));
  } catch (error) {
    if(req?.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
};

export {
  fileUpload
}