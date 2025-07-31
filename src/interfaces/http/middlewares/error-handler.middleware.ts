import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../domain/_shared/errors/app.error';
import { ZodError } from 'zod';
import { EntityValidationError } from '../../../domain/_shared/validators/validation.error';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction, // keep Express signature but ignore param
) => {
  console.error('🔥 Unhandled error:', err);
  if (err?.stack) console.error(err.stack);

  // Helper to create consistent error responses
  const buildErrorResponse = (
    statusCode: number,
    message: string,
    errors: any = {},
  ) => ({
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });

  if (err instanceof ZodError) {
    return res
      .status(422)
      .json(
        buildErrorResponse(422, 'Validation failed', err.flatten().fieldErrors),
      );
  }

  if (err instanceof EntityValidationError) {
    return res
      .status(422)
      .json(buildErrorResponse(422, 'Entity validation failed', err.error));
  }

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(buildErrorResponse(err.statusCode, err.message, err.errors));
  }

  return res.status(500).json(buildErrorResponse(500, 'Internal server error'));
};
