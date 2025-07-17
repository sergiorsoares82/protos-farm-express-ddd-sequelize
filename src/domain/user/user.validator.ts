import { z } from 'zod';
import { UserEntity } from './user.entity';
import type { EntityValidator } from '../_shared/validators/entity-validator';

export class UserValidator implements EntityValidator<UserEntity> {
  private _errors: Record<string, string[]> | null = null;

  validate(entity: UserEntity): boolean {
    const schema = z.object({
      username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be at most 50 characters'),
      email: z.string().email('Invalid email'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      is_active: z.boolean(),
      created_at: z.date(),
      updated_at: z.date(),
    });

    const result = schema.safeParse({
      username: entity.username,
      email: entity.email,
      password: entity.password,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });

    if (!result.success) {
      this._errors = {};
      for (const issue of result.error.errors) {
        const path = issue.path.join('.');
        if (!this._errors[path]) {
          this._errors[path] = [];
        }
        this._errors[path].push(issue.message);
      }
      return false;
    }

    this._errors = null;
    return true;
  }

  get errors(): Record<string, string[]> | null {
    return this._errors;
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
