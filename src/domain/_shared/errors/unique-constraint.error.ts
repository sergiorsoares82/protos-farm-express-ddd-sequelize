import { AppError } from './app.error';

export class UniqueConstraintError extends AppError {
  constructor(field: string, value: string) {
    super(`${field} already in use`, 409, {
      [field]: [`${field} '${value}' is already in use.`],
    });
  }
}
