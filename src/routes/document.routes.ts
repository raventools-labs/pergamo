import multer from 'multer';

import Config from '../config';
import * as Controllers from '../controllers/document.controllers';

const upload = multer({ dest: Config.tmp_base });
const router = require('express').Router();

router.post('/', upload.single('document'), Controllers.fileUpload);

export default router;