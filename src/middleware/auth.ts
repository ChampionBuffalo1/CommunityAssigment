import { errorResponse } from '../utils';
import { Request, Response, NextFunction } from 'express';

export default function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.payload) {
    next();
  } else {
    res.status(401).json(
      errorResponse({
        message: 'You need to sign in to proceed.',
        code: 'NOT_SIGNEDIN',
      }),
    );
  }
}
