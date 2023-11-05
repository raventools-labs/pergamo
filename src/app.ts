import Middleware from './middleware';
import Routes from './routes';
import Config from './config';
import log from './utils/log';
import antivirus from './utils/antivirus';
import express from 'express';

const packageJson = require('../package.json')
const bodyParser = require('body-parser')

export const app = async () => {

  if(Config.enable_antivirus) await antivirus.init();
  
  const app = express();

  app.use(bodyParser.json({ type: 'application/json' }));

  app.use(Middleware.global);

  app.get('/version', (req, res) => {
    res.status(200).json({ version: packageJson.version })
  });

  app.use('/organization', Routes.organization);
  app.use('/document', Routes.document);

  app.use(Middleware.error);

  const server = app.listen(Config.port, () => {
    log.info(`Server running on port ${Config.port}`);
  });

  return server;
}
