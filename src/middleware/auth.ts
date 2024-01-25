import { Request, Response, NextFunction } from 'express';

export default function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.payload) {
    console.log('authenticated user');

    next();
  }
  res.status(401).json({
    status: false,
    errors: [
      {
        message: 'You need to sign in to proceed.',
        code: 'NOT_SIGNEDIN',
      },
    ],
  });
}
