import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateBody = <T>(schema: ZodType<T, any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: result.error.format(),
      });
    }

    req.body = result.data;
    next();
  };
};
