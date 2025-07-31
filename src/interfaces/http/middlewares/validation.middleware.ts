// src/infra/http/middlewares/validation.middleware.ts
import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { SyntaxValidationError } from '../errors/syntax-validation.error';

export const validateDto = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatted = result.error.errors.reduce(
        (acc, e) => {
          const field = e.path.join('.') || 'root';
          if (!acc[field]) acc[field] = [];
          acc[field].push(e.message);
          return acc;
        },
        {} as Record<string, string[]>,
      );
      throw new SyntaxValidationError(formatted);
    }
    req.body = result.data;
    next();
  };
};
