import { AppError } from './app.error';

export class EntityValidationError extends AppError {
  constructor(public readonly fieldErrors: Record<string, string[]>) {
    super('Entity Validation Error', 422, fieldErrors);
  }
}
