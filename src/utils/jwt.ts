import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';
import { JwtSecret, maxTokenAge } from '../Constants';

function getJwtPayload(token: string): JwtPayload {
  try {
    const jwtDecoded = jwt.verify(token, JwtSecret) as JwtPayload;
    return jwtDecoded;
  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError' || (err as Error).name === 'JsonWebTokenError')
      throw new Error('JwtError', {
        cause: 'Invalid JWT Payload',
      });
  }

  // Never reached, if JwtError is thrown, the function will exit
  return undefined as never;
}

function createJwtPayload(payload: JwtPayload) {
  const token = jwt.sign(payload, JwtSecret, {
    expiresIn: maxTokenAge,
  });
  return token;
}

export { getJwtPayload, createJwtPayload };
