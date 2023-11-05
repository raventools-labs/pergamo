import log from '..//utils/log';
import JWTUtil from '../utils/jwt';
import { StatusCodes, ValidationError } from './error.middleware';

export const authHandler = async (req, res, next) => {

  const token = req.headers['authorization'];

  try {

    if (!token) throw new ValidationError(StatusCodes.UNAUTHORIZED, 'TOKEN_REQUIRED','Token not provided')

    req.user = await JWTUtil.verifyToken(token);
    log.debug(`${req.method} ${req.originalUrl} - ${req.id} | Organization: ${req.user.name}`);
    next();

  } catch(err) {
    next(err);
  }
};

export const authMasterHandler = async (req, res, next) => {

  const token = req.headers['authorization'];

  try {

    if (!token) throw new ValidationError(StatusCodes.UNAUTHORIZED, 'TOKEN_REQUIRED','Token not provided')

    req.user = await JWTUtil.verifyToken(token);
    if (!req.user.master) throw new ValidationError(StatusCodes.UNAUTHORIZED, 'NOT_MASTER','User not master')
    next();

  } catch(err) {
    next(err);
  }
};