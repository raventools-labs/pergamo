import multer from 'multer';
import Middleware from '../middleware';
import Config from '../config';
import * as Controllers from '../controllers/document.controllers';

const upload = multer({ dest: Config.tmp_base });
const router = require('express').Router();

router.post('/', Middleware.auth, upload.single('document'), Controllers.upload);
router.get('/:id', Middleware.auth, Controllers.getMetadata);
router.put('/:id', Middleware.auth, Controllers.modifyMetadata);
router.get('/:id/file', Middleware.auth, Controllers.getFile);
router.put('/:id/file', Middleware.auth, upload.single('document'), Controllers.modifyFile);
router.get('/:id/versions', Middleware.auth, Controllers.versionsFile);
router.delete('/:id', Middleware.auth, Controllers.remove);

export default router;