import fs from "fs";

export const createDir = async (destinationDir) => {

  const dirExists = await fs.promises.access(destinationDir).then(() => true).catch(() => false);

  if (!dirExists) {
    await fs.promises.mkdir(destinationDir, { recursive: true });
  }
}