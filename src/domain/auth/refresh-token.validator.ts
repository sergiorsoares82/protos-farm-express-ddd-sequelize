// domain/user/user.validator.ts
import { ZodValidatorFields } from '../_shared/validators/zod-validator-fields';
import { RefreshTokenConstructorSchema } from './refresh-token.entity';

export class RefreshTokenValidator extends ZodValidatorFields {
  schema = RefreshTokenConstructorSchema;
}

export class RefreshTokenValidatorFactory {
  static create() {
    return new RefreshTokenValidator();
  }
}
