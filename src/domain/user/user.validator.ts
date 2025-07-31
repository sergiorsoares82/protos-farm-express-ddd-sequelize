// domain/user/user.validator.ts
import { ZodValidatorFields } from '../_shared/validators/zod-validator-fields';
import { UserFullSchema } from './user.entity';

export class UserValidator extends ZodValidatorFields {
  schema = UserFullSchema;
}

export class UserValidatorFactory {
  static create() {
    return new UserValidator();
  }
}
