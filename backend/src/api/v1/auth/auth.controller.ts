import type { Request, Response } from 'express';
import authService from './auth.service';

async function refreshToken(req: Request, res: Response) {
  const result = await authService.refreshToken(req.userId!);

  res.status(result.status).json(result);
}

async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);

  res.status(result.status).json(result);
}

async function register(req: Request, res: Response) {
  const result = await authService.register(req.body);

  res.status(result.status).json(result);
}

export default {
  refreshToken,
  login,
  register,
};
