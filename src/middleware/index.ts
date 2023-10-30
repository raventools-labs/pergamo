import * as error from './error.middleware'
import * as global from './global.middleware'

export default {
  error: error.errorHandler,
  global: global.globalHandler
}