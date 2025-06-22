import express from 'express';
import authRouter from './auth';
import patientsRouter from './patients';
import middleware from '../middleware';
import usersRouter from './users';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/patients', middleware.authenticated, patientsRouter);
v1Router.use('/users', middleware.authenticated, usersRouter);

export default v1Router;
