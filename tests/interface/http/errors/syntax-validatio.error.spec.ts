// syntax-validation-error.spec.ts
import { AppError } from '../../../../src/domain/_shared/errors/app.error';
import { SyntaxValidationError } from '../../../../src/interfaces/http/errors/syntax-validation.error';

describe('SyntaxValidationError', () => {
  it('should be instance of SyntaxValidationError and AppError', () => {
    const errors = { field1: ['Error1'], field2: ['Error2'] };
    const error = new SyntaxValidationError(errors);

    expect(error).toBeInstanceOf(SyntaxValidationError);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should have correct message, status and errors', () => {
    const errors = { field: ['Invalid value'] };
    const error = new SyntaxValidationError(errors);

    expect(error.message).toBe('Syntax Validation failed');
    expect(error.statusCode).toBe(422);
    expect(error.errors).toEqual(errors);
  });

  it('should retain prototype chain (instanceof Error)', () => {
    const error = new SyntaxValidationError({});
    expect(error instanceof Error).toBe(true);
  });
});
