import NodeClam  from 'clamscan';
import log from './log';
import { StatusCodes, ValidationError } from '../middleware/error.middleware';

class Antivirus {

  private clamscan;

  async init() {
    if(!this.clamscan) {
      this.clamscan = await new NodeClam().init({
        removeInfected: true
      });
  
      const version = await this.clamscan.getVersion();
      log.info(`Antivirus: ${version}`);
    }
  }

  scan = async (filePath:string, req:any) => {

    await this.init();
    
    const {isInfected, file, viruses} = await this.clamscan.isInfected(filePath);
  
    if(isInfected) throw new ValidationError(StatusCodes.BAD_REQUEST,
      'FILE_CORRUPT', `File is infected with ${viruses}`, req)
  }
}

export default new Antivirus();