import * as UUID from 'uuid';

import log from '../utils/log';
import Config from '../config';

export const globalHandler = (req, res, next) => {
  req.id = UUID.v4();
  const startTime = process.hrtime();
  log.debug(`${req.method} ${req.originalUrl} - ${req.id} | Start request`)

  res.on('finish', () => {
    const endTime = process.hrtime(startTime);
    const elapsedTimeInMs = (endTime[0] * 1e3 + endTime[1] / 1e6);
    log.info(`${req.method} ${req.originalUrl} - ${req.id} | Execution time: ${elapsedTimeInMs} ms | Status: ${res.statusCode}`);
  });

  next();
}