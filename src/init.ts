import * as Utils from './utils/files';
import Config from './config';
const path = require('path');

const init = async () => {
  console.log('Creating data directory...');

  Utils.createDir(Config.path_base);
  console.log('Created data directory:', Config.path_base);

  Utils.createDir(Config.tmp_base);
  console.log('Created data temp directory:', Config.tmp_base);
}

init();