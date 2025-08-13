// domain/user/user.validator.ts

import { ZodValidatorFields } from '../_shared/validators/zod-validator-fields';
import { PersonFullSchema } from './person.entity';

export class PersonValidator extends ZodValidatorFields {
  schema = PersonFullSchema;
}

export class PersonValidatorFactory {
  static create() {
    return new PersonValidator();
  }
}
