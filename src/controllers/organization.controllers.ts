
import sequelize, { QueryTypes } from "../utils/db";
import JWTUtils from '../utils/jwt';
import Config from '../config';
import { ValidationError, StatusCodes } from "../middleware/error.middleware";
import owasp from 'owasp-password-strength-test';

owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass : 4,
});

const login = async (req, res, next) => {
  
  try {

    const { body } = req;

    if(!body?.name && !body?.password) throw new ValidationError(StatusCodes.BAD_REQUEST, 
      'INCORRECT_LOGIN', 'Incorrect Login', req);
  
    const { name, password } = req.body;

    let payload:any = { name };
    
    if(name === Config.user_master && password === Config.password_master) {

      payload.master = true;

    } else {

      const result = await sequelize.query(
        `SELECT id 
        FROM pergamo.organization 
        WHERE name = :name AND password = crypt(:password, password) AND discharge_date IS NULL;`, {
        replacements: { name, password },
        type: QueryTypes.SELECT
      });

      if(result.length !== 1) throw new ValidationError(StatusCodes.NOT_FOUND, 
        'INCORRECT_LOGIN', 'Incorrect Login', req);
  
      const { id }:any = result[0];

      payload.organization = id;
    }
    
    res.status(StatusCodes.OK)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        token: await JWTUtils.generateToken(payload)
      }));

  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {

  try {

    if(!req.body?.name) throw new ValidationError(StatusCodes.BAD_REQUEST, 
      'REQUIRED_NAME', 'Required name', req);
    if(!req.body?.password) throw new ValidationError(StatusCodes.BAD_REQUEST, 
      'REQUIRED_PASSWORD', 'Required password', req);

    const { name, password } = req.body;
    const id = req.body.id;

    let result:any;

    if(id) {
      result = (await sequelize.query(
        `INSERT INTO pergamo.organization(id, name, password) 
        VALUES (:id, :name, crypt(:password, gen_salt('bf')))
        RETURNING *;`, {
        replacements: { id, name, password },
        type: QueryTypes.UPDATE
      }));
    } else {
      result = (await sequelize.query(
        `INSERT INTO pergamo.organization(name, password) 
        VALUES (:name, crypt(:password, gen_salt('bf')))
        RETURNING *;`, {
        replacements: { name, password },
        type: QueryTypes.UPDATE
      }));
    }

    const organization = result[0][0];
    delete organization.password;

    res.status(StatusCodes.OK)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(organization));
      
    } catch (error) {
      next(error);
    }
}


const changePassword = async (organization:string, req:any) => {

  const { body } = req;

  if(!body?.password) throw new ValidationError(StatusCodes.BAD_REQUEST, 
    'REQUIRED_PASSWORD', 'Required password', req);

  const { password } = body;

  const testPassword = owasp.test(password);

  if(testPassword.errors && testPassword.errors.length > 0) throw new ValidationError(StatusCodes.BAD_REQUEST, 
    'INVALID_PASSWORD', testPassword.errors[0], req);

  const result:any = (await sequelize.query(
    `UPDATE pergamo.organization 
    SET password = crypt(:password, gen_salt('bf'))
    WHERE id = :organization AND password != crypt(:password, password) RETURNING *;`, {
    replacements: { organization, password },
    type: QueryTypes.UPDATE
  }));

  if(result[0].length === 0) throw new ValidationError(StatusCodes.BAD_REQUEST, 
    'SAME_PASSWORD', 'Password is the same', req);
}

const changePasswordUser = async (req, res, next) => {

  try {

    const { organization } = req.user;

    console.log('User', req.user);

    await changePassword(organization, req);

    res.status(StatusCodes.OK)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ message: 'Password change successfully'}));
      
    } catch (error) {
      next(error);
    }
}

const changePasswordMaster = async (req, res, next) => {

  try {

    if(!req.body?.organization) throw new ValidationError(StatusCodes.BAD_REQUEST, 
      'REQUIRED_ORGANIZATION', 'Required organization', req);

    const { organization } = req.body;

    await changePassword(organization, req);

    res.status(StatusCodes.OK)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ message: 'Password change successfully'}));
      
    } catch (error) {
      next(error);
    }
}

export {
  login,
  create,
  changePasswordUser,
  changePasswordMaster
}