import { Request, Response, NextFunction } from 'express';
import {INVALID_TOKEN_FORMAT, UNAUTHORIZED} from '@app/api/constants/errors/errors.constant';
import { verifyJWT } from '@expressControllers/JWT/JWT.controller'


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: INVALID_TOKEN_FORMAT });
    return
  }

  const token = authHeader.split(' ')[1];

  try {
    const validToken = verifyJWT(token);
    if (validToken instanceof Error) {
      res.status(401).json({ error: validToken.message });
      return;
    }
    next();
  } catch (err) {
    res.status(401).json({ error: UNAUTHORIZED });
    return;
  }
}
