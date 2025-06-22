import type { Request, Response, NextFunction } from 'express';
import userRepository from '../../repository/user/user.repository';
import jwt from '../../utils/jwt';

async function getUserIdFromIdToken(req: Request) {
  try {
    const userId = jwt.verify(req.headers.authorization);
    if (!userId) {
      return null;
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return null;
    }

    return user._id;
  } catch (err) {
    return null;
  }
}

async function authenticated(req: Request, res: Response, next: NextFunction) {
  const userId = await getUserIdFromIdToken(req);

  if (userId) {
    req.userId = userId;
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export default { authenticated };
