import { ZodType, z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { validateDto } from '../../../../src/interfaces/http/middlewares/validation.middleware';
import { SyntaxValidationError } from '../../../../src/interfaces/http/errors/syntax-validation.error';

describe('validateDto middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  // Define a sample Zod schema for testing
  const schema: ZodType<{ name: string; age: number }> = z.object({
    name: z.string().min(3),
    age: z.number().int().positive(),
  });

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {};
    next = jest.fn();
  });

  it('should call next() and replace req.body with parsed data when validation succeeds', () => {
    req.body = { name: 'John Doe', age: 25 };

    const middleware = validateDto(schema);
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ name: 'John Doe', age: 25 });
  });

  it('should throw SyntaxValidationError when validation fails', () => {
    req.body = { name: 'Jo', age: -5 };

    const middleware = validateDto(schema);

    try {
      middleware(req as Request, res as Response, next);
      // fail the test if above line does NOT throw
      throw new Error('Middleware did not throw');
    } catch (err) {
      expect(err).toBeInstanceOf(SyntaxValidationError);
      if (err instanceof SyntaxValidationError) {
        expect(err.errors).toHaveProperty('name');
        expect(err.errors.name).toContain(
          'String must contain at least 3 character(s)',
        );
        expect(err.errors).toHaveProperty('age');
        expect(err.errors.age).toContain('Number must be greater than 0');
      }
    }
  });

  it('should accumulate multiple errors for the same field', () => {
    // schema with multiple validations for a single field
    const complexSchema = z.object({
      password: z.string().min(6, 'Too short').max(10, 'Too long'),
    });

    req.body = { password: '123' }; // too short

    const middleware = validateDto(complexSchema);

    try {
      middleware(req as Request, res as Response, next);
      throw new Error('Middleware did not throw');
    } catch (err) {
      expect(err).toBeInstanceOf(SyntaxValidationError);
      if (err instanceof SyntaxValidationError) {
        expect(err.errors).toHaveProperty('password');
        expect(err.errors.password).toContain('Too short');
        // Because max is 10, and '123' is less than 10, no max error, so only one error expected here.
        expect(err.errors.password.length).toBe(1);
      }
    }
  });

  it('should use "root" as field name when error path is empty', () => {
    // Create a schema that fails with empty path error
    // For example, a refinement that fails the entire object

    const rootErrorSchema = z
      .object({
        field1: z.string(),
      })
      .refine(() => false, { message: 'Custom root error' });

    req.body = { field1: 'value' };

    const middleware = validateDto(rootErrorSchema);

    try {
      middleware(req as Request, res as Response, next);
      throw new Error('Middleware did not throw');
    } catch (err) {
      expect(err).toBeInstanceOf(SyntaxValidationError);
      if (err instanceof SyntaxValidationError) {
        expect(err.errors).toHaveProperty('root');
        expect(err.errors.root).toContain('Custom root error');
      }
    }
  });
});
