import multer from 'multer';

import Config from '../config';
import * as Controllers from '../controllers/document.controllers';

const upload = multer({ dest: Config.tmp_base });
const router = require('express').Router();

router.get('/:id', Controllers.getMetadata);
router.get('/:id/file', Controllers.getFile);
router.post('/', upload.single('document'), Controllers.upload);
router.delete('/:id', Controllers.remove);

export default router;