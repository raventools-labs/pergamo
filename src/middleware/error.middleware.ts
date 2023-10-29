import {
	StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

class ValidationError extends Error {

  statusCode:number;
  error:string;

  constructor(statusCode:number, error:string, message:string) {
    super();
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
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
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .set('Content-Type', 'application/json')
      .send({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      });
    }
  }
}

export {
  errorHandler,
  StatusCodes,
  ValidationError
}