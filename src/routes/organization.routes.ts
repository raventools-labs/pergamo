import * as Controllers from '../controllers/organization.controllers';
import Middleware from '../middleware';

const router = require('express').Router();

router.post('/login', Controllers.login);
router.post('/changePassword', Middleware.auth, Controllers.changePasswordUser);
router.post('/master/create', Middleware.authMaster,Controllers.create);
router.post('/master/changePassword', Middleware.authMaster, Controllers.changePasswordMaster);

export default router;