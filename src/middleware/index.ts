import * as error from './error.middleware'
import * as global from './global.middleware'
import * as auth from './auth.middleware'

export default {
  error: error.errorHandler,
  global: global.globalHandler,
  auth: auth.authHandler,
  authMaster: auth.authMasterHandler
}