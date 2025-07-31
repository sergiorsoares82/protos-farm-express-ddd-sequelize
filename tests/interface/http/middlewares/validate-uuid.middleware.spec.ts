import { Request, Response, NextFunction } from 'express';
import { validateUUID } from '../../../../src/interfaces/http/middlewares/validate-uuid.middleware';
import { SyntaxValidationError } from '../../../../src/interfaces/http/errors/syntax-validation.error';

describe('validateUUID middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = { params: {} };
    res = {};
    next = jest.fn();
  });

  it('should call next if param is a valid UUID', () => {
    req.params = { id: '550e8400-e29b-41d4-a716-446655440000' };

    const middleware = validateUUID('id');
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should throw SyntaxValidationError if param is missing', () => {
    req.params = {};

    const middleware = validateUUID('id');

    expect(() => middleware(req as Request, res as Response, next)).toThrow(
      SyntaxValidationError,
    );

    try {
      middleware(req as Request, res as Response, next);
    } catch (err) {
      if (err instanceof SyntaxValidationError) {
        expect(err.errors).toEqual({
          id: ['Invalid UUID format for id'],
        });
      } else {
        throw err; // rethrow if unexpected
      }
    }
  });

  it('should throw SyntaxValidationError if param is invalid UUID', () => {
    req.params = { id: 'invalid-uuid' };

    const middleware = validateUUID('id');

    expect(() => middleware(req as Request, res as Response, next)).toThrow(
      SyntaxValidationError,
    );

    try {
      middleware(req as Request, res as Response, next);
    } catch (err) {
      if (err instanceof SyntaxValidationError) {
        expect(err.errors).toEqual({
          id: ['Invalid UUID format for id'],
        });
      } else {
        throw err; // rethrow if unexpected
      }
    }
  });
});
