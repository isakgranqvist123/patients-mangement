import 'dotenv/config';
import express from 'express';
import apiRouter from './api';
import cors from 'cors';
import env from './config/env';
import { httpStatus } from './api/api.types';

const app = express();

app.use(cors());
app.use(express.json());

app.use(/(.*)/, (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', apiRouter);
app.all(/(.*)/, (req, res) => {
  res.status(404).json({
    data: null,
    status: httpStatus.NOT_FOUND,
    message: `${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
