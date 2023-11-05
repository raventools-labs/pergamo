import fs from "fs";
import fs_extra from "fs-extra";
import path from "path";
import mv from "mv";

import Config from '../config'

const mvAsync = async (origen, destino) => {
  return new Promise((resolve, reject) => {
    mv(origen, destino, { mkdirp: true }, (error) => {
      if (error) {
        reject(error);
      } 
      resolve({});
    });
  });
}

const pathFile = (metadata:any) => {

  const { uuid_sha256, extension, organization } = metadata;

  let pathFile = 
    '/' + uuid_sha256.substring(0,2) + 
    '/' + uuid_sha256.substring(2,6) + 
    '/' + uuid_sha256.substring(6,14) + 
    '/' + uuid_sha256.substring(14) + 
    '/' + uuid_sha256 + '.' + extension;

  return path.join(Config.path_base, organization, pathFile);
}

const mkdir = async (destinationDir) => {

  const dirExists = await fs.promises.access(destinationDir).then(() => true).catch(() => false);

  if (!dirExists) {
    await fs.promises.mkdir(destinationDir, { recursive: true });
  }
}

const rmdir = async (path_base:string, directory:string) => {

  await fs_extra.remove(directory);

  let levels = directory.split(path.sep);
  levels.pop();
  directory = levels.join(path.sep);

  let finish = false;
  while(directory !== path.join(path_base) && !finish) {
    const files = await fs.promises.readdir(directory)
    if (files.length === 0) {
      await fs.promises.rmdir(directory);
      levels = directory.split(path.sep);
      levels.pop();
      directory = levels.join(path.sep);
    } else {
      finish = true;
    }
  }
}

export default {
  pathFile,
  mvAsync,
  mkdir,
  rmdir
}