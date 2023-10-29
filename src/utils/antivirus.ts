import NodeClam  from 'clamscan';
import { StatusCodes, ValidationError } from '../middleware/error.middleware';

class Antivirus {

  private clamscan;

  async init() {
    if(!this.clamscan) {
      this.clamscan = await new NodeClam().init({
        removeInfected: true
      });
  
      const version = await this.clamscan.getVersion();
      console.log(version);
    }
  }

  scan = async (filePath:string) => {

    await this.init();
    
    const {isInfected, file, viruses} = await this.clamscan.isInfected(filePath);
  
    if(isInfected) {
      console.log(`${file} is infected with ${viruses}!`);
      throw new ValidationError(StatusCodes.BAD_REQUEST,'FILE_CORRUPT', 'File is corrupt')
    }
  }
}

export default new Antivirus();