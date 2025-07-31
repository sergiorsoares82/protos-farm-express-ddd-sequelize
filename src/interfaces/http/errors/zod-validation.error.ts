// src/infra/http/errors/zod-validation.error.ts
import { AppError } from '../../../domain/_shared/errors/app.error';
import { ZodError } from 'zod';

export class ZodValidationError extends AppError {
  constructor(error: ZodError) {
    const formatted = error.errors.reduce(
      (acc: Record<string, string[]>, e) => {
        const path = e.path.join('.') || 'root';
        if (!acc[path]) acc[path] = [];
        acc[path].push(e.message);
        return acc;
      },
      {},
    );
    super('Validation failed', 422, formatted);
  }
}
