import express from 'express';

import middleware from '../../middleware';
import authCtrl from './auth.controller';

const authRouter = express.Router();

authRouter.post('/login', authCtrl.login);
authRouter.post('/register', authCtrl.register);
authRouter.get(
  '/refresh-token',
  middleware.authenticated,
  authCtrl.refreshToken,
);

export default authRouter;
