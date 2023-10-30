import {
	StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';
import log from '../utils/log';

class ValidationError extends Error {

  statusCode:number;
  error:string;

  constructor(statusCode:number, error:string, message:string, req?:any) {
    super();
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
    if(req) log.warn(`${req.method} ${req.originalUrl} - ${req.id} | Error(${error}): ${message}`);
  }
}

const errorHandler = (err, req, res, next) => {

  if(err) {
    if(err instanceof  ValidationError) {

      res.status(err.statusCode)
      .set('Content-Type', 'application/json')
      .send({
        statusCode: err.statusCode,
        error: err.message
      });

    } else {
      log.error(`${req.method} ${req.originalUrl} - ${req.id} | ${err}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .set('Content-Type', 'application/json')
      .send({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      });
    }
  }
  next();
}

export {
  errorHandler,
  StatusCodes,
  ValidationError
}