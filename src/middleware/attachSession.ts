import { getJwtPayload, errorResponse } from '../utils';
import type { NextFunction, Request, Response } from 'express';

const attachSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const jwtToken = req.headers.authorization?.replace('Bearer ', '');
  try {
    if (jwtToken) req.payload = getJwtPayload(jwtToken);
    next();
  } catch (err) {
    if ((err as Error).name === 'JwtError') {
      res.status(400).json(
        errorResponse({
          code: 'INVALID_TOKEN',
          message: 'Your access token has been expired.',
        }),
      );
    }
  }
};

export { attachSession };
