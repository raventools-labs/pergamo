import Middleware from './middleware';
import Routes from './routes';
import Config from './config';
import antivirus from './utils/antivirus';

const express = require('express');

const main = async () => {

  if(Config.enable_antivirus) await antivirus.init();
  
  const app = express();

  app.use('/document', Routes.document);

  app.use(Middleware.error);

  app.listen(Config.port, () => {
    console.log(`Server running on port ${Config.port}`);
  });
}

main();