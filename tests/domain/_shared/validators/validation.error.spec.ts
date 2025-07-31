// validation-error.spec.ts

import {
  EntityValidationError,
  ValidationError,
} from '../../../../src/domain/_shared/validators/validation.error';
import type { FieldsErrors } from '../../../../src/domain/_shared/validators/validator-fields-interface';

describe('ValidationError', () => {
  it('should create a ValidationError with a default message', () => {
    const error = new ValidationError('Something went wrong');
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Something went wrong');
    expect(error.name).toBe('Error'); // inherits default Error name
  });
});

describe('EntityValidationError', () => {
  it('should create an EntityValidationError with default message', () => {
    const fieldsErrors: FieldsErrors[] = [
      { field: ['name'], message: ['Required'] },
    ];
    const error = new EntityValidationError(fieldsErrors);

    expect(error).toBeInstanceOf(EntityValidationError);
    expect(error.message).toBe('Entity Validation Error');
    expect(error.error).toEqual(fieldsErrors);
  });

  it('should allow overriding the error message', () => {
    const fieldsErrors: FieldsErrors[] = [
      { field: ['email'], message: ['Invalid'] },
    ];
    const error = new EntityValidationError(fieldsErrors, 'Custom Message');

    expect(error.message).toBe('Custom Message');
    expect(error.error).toEqual(fieldsErrors);
  });

  it('should count the number of error keys', () => {
    const errorsObj = {
      name: ['Required'],
      email: ['Invalid'],
    } as unknown as FieldsErrors[];
    const error = new EntityValidationError(errorsObj);

    expect(error.count()).toBe(Object.keys(errorsObj).length);
  });

  it('should return 0 when no errors are present', () => {
    const errorsObj = {} as unknown as FieldsErrors[];
    const error = new EntityValidationError(errorsObj);

    expect(error.count()).toBe(0);
  });
});
