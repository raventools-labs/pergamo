import crypto from "crypto";
import fs from "fs";

export const sha256 = async(str:string ) => {

  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

export const sha256File = async(filePath:string ) => {

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const hash = crypto.createHash('sha256');

    fileStream.on('data', (data) => {
      hash.update(data);
    });

    fileStream.on('end', () => {
      const fileHash = hash.digest('hex');
      resolve(fileHash);
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}