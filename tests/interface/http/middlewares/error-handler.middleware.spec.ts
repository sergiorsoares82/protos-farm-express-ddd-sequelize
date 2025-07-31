// error-handler.spec.ts
import { AppError } from '../../../../src/domain/_shared/errors/app.error';
import { ZodError } from 'zod';
import { EntityValidationError } from '../../../../src/domain/_shared/validators/validation.error';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../../src/interfaces/http/middlewares/error-handler.middleware';

describe('errorHandler middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // silence console
  });

  it('should handle ZodError and return 422', () => {
    const zodError = new ZodError([
      { path: ['field1'], message: 'Invalid field', code: 'custom' },
    ]);
    errorHandler(zodError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation failed',
      errors: zodError.flatten().fieldErrors,
      path: undefined,
      statusCode: 422,
      timestamp: expect.any(String),
    });
  });
  it('should handle EntityValidationError and return 422', () => {
    const entityError = new EntityValidationError([
      { field: ['field1'], messages: ['Error1'] },
    ]);
    errorHandler(entityError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Entity validation failed',
      errors: [{ field: ['field1'], messages: ['Error1'] }],
      path: undefined,
      statusCode: 422,
      timestamp: expect.any(String),
    });
  });

  it('should handle AppError and return custom status and message', () => {
    const appError = new AppError('Custom error', 400, { field2: ['Bad'] });
    errorHandler(appError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Custom error',
      errors: { field2: ['Bad'] },
      path: undefined,
      statusCode: 400,
      timestamp: expect.any(String),
    });
  });

  it('should handle generic error and return 500', () => {
    const genericError = new Error('Unexpected failure');
    errorHandler(genericError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      errors: {},
      path: undefined,
      statusCode: 500,
      timestamp: expect.any(String),
    });
  });

  it('should log errors to console', () => {
    const error = new Error('Log me');
    error.stack = 'stack trace here';
    errorHandler(error, req as Request, res as Response, next);

    expect(console.error).toHaveBeenCalledWith('🔥 Unhandled error:', error);
    expect(console.error).toHaveBeenCalledWith(error.stack);
  });
});
