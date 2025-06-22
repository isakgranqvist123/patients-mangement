import type { Request, Response } from 'express';
import authService from './users.service';

async function getUsers(req: Request, res: Response) {
  const result = await authService.getUsers();

  res.status(result.status).json(result);
}

export default {
  getUsers,
};
