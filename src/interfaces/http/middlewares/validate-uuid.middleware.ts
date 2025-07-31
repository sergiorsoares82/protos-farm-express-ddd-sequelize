import { Request, Response, NextFunction } from 'express';
import { validate as isUUID } from 'uuid';
import { SyntaxValidationError } from '../errors/syntax-validation.error';

export function validateUUID(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (!isUUID(value)) {
      throw new SyntaxValidationError({
        [paramName]: [`Invalid UUID format for ${paramName}`],
      });
    }
    next();
  };
}
