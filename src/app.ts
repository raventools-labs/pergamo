import Middleware from './middleware';
import Routes from './routes';
import Config from './config';
import log from './utils/log';
import antivirus from './utils/antivirus';

const express = require('express');

const main = async () => {

  if(Config.enable_antivirus) await antivirus.init();
  
  const app = express();
  
  app.use(Middleware.global);

  app.use('/document', Routes.document);

  app.use(Middleware.error);

  app.listen(Config.port, () => {
    log.info(`Server running on port ${Config.port}`);
  });
}

main();