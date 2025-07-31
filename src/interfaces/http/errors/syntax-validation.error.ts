import { AppError } from '../../../domain/_shared/errors/app.error';

export class SyntaxValidationError extends AppError {
  constructor(errors: Record<string, string[]>) {
    super('Syntax Validation failed', 422, errors);
  }
}
