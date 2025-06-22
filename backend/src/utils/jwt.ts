import jwt from 'jsonwebtoken';
import env from '../config/env';

function verify(token?: string) {
  try {
    if (!token) {
      return null;
    }

    token = token.replace('Bearer ', '').trim();

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const userId = (decoded as { userId: string }).userId;
    if (!userId) {
      return null;
    }

    return userId;
  } catch (err) {
    console.log(err);

    return null;
  }
}

function sign(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

export default { verify, sign };
