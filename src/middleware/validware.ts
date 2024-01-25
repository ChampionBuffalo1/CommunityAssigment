import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export default function validateSchema(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = await schema.spa(req.body);
    if (parsedBody.success) {
      next();
    } else {
      res.status(400).send({
        message: parsedBody.error.flatten().fieldErrors,
      });
    }
  };
}
