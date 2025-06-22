import express from 'express';

import usersController from './users.controller';

const usersRouter = express.Router();

usersRouter.get('/', usersController.getUsers);

export default usersRouter;
