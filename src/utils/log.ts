import Config from "../config";

const pino = require('pino')
const transport = pino.transport({
  target: 'pino-pretty',
  options: { destination: 1 }
})
const log = pino(transport)

if(Config.debug) log.level =  'debug';

export default log;