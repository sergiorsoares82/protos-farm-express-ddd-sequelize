import { z } from 'zod';
import { ZodValidatorFields } from '../../../../src/domain/_shared/validators/zod-validator-fields';

jest.mock(
  '../../../../src/domain/_shared/validators/zod-to-notification.helper',
  () => ({
    addZodErrorsToNotification: jest.fn(),
  }),
);

import * as zodHelper from '../../../../src/domain/_shared/validators/zod-to-notification.helper';
import { Notification } from '../../../../src/domain/_shared/validators/notification';

describe('ZodValidatorFields', () => {
  class TestValidator extends ZodValidatorFields {
    schema = z.object({
      name: z.string().min(3, 'Name too short'),
      age: z.number().int().positive(),
      email: z.string().email(),
    });
  }

  let validator: TestValidator;
  let notification: Notification;

  beforeEach(() => {
    validator = new TestValidator();
    notification = new Notification();
    jest.clearAllMocks();

    (zodHelper.addZodErrorsToNotification as jest.Mock).mockImplementation(
      (error, notif) => {
        for (const issue of error.errors) {
          const path = issue.path.join('.') || 'root';
          notif.addError(issue.message, path);
        }
      },
    );
  });

  it('should validate successfully with valid data', () => {
    const data = { name: 'John Doe', age: 25, email: 'john@example.com' };

    const result = validator.validate(notification, data);

    expect(result).toBe(true);
    expect(notification.hasErrors()).toBe(false);
    expect(validator.errors).toBeNull();
  });

  it('should fail validation and add errors to notification', () => {
    const data = { name: 'Jo', age: -5, email: 'not-an-email' };

    const result = validator.validate(notification, data);

    expect(result).toBe(false);
    expect(notification.hasErrors()).toBe(true);
    expect(validator.errors).not.toBeNull();

    expect(validator.errors).toHaveProperty('name');
    expect(validator.errors).toHaveProperty('age');
    expect(validator.errors).toHaveProperty('email');

    expect(notification.getErrors('name')).toContain('Name too short');
    expect(notification.getErrors('age')[0].toLowerCase()).toContain(
      'greater than 0',
    );
    expect(notification.getErrors('email')).toContainEqual(
      expect.stringContaining('email'),
    );
  });

  it('should validate only selected fields when fields param is used', () => {
    const data = { name: 'Jo', age: 25, email: 'john@example.com' };

    // Only validate "name" field (which is invalid)
    const result = validator.validate(notification, data, ['name']);

    expect(result).toBe(false);
    expect(notification.getErrors('name')).toContain('Name too short');
    expect(notification.getErrors('age')).toEqual([]);
    expect(notification.getErrors('email')).toEqual([]);

    expect(validator.errors).toHaveProperty('name');
    expect(Object.keys(validator.errors!)).toHaveLength(1);
  });

  it('should clear errors when validation succeeds after failure', () => {
    // First fail validation (name too short)
    validator.validate(notification, { name: 'Jo', age: 25, email: 'a@b.co' });
    expect(validator.errors).not.toBeNull();

    // Then validate correct data
    const result = validator.validate(notification, {
      name: 'John',
      age: 25,
      email: 'a@b.co',
    });
    expect(result).toBe(true);
    expect(validator.errors).toBeNull();
  });

  it('should handle invalid field names gracefully when fields param is used', () => {
    const data = { name: 'John', age: 25, email: 'john@example.com' };

    // Pass a field name that doesn't exist in the schema
    // Expect validation to succeed (as it ignores unknown fields)
    const result = validator.validate(notification, data, ['nonexistent']);

    expect(result).toBe(true);
    expect(notification.hasErrors()).toBe(false);
    expect(validator.errors).toBeNull();
  });

  it('should validate all fields when empty array is passed as fields param', () => {
    const data = { name: 'John Doe', age: 25, email: 'john@example.com' };

    const result = validator.validate(notification, data, []);

    expect(result).toBe(true);
    expect(notification.hasErrors()).toBe(false);
    expect(validator.errors).toBeNull();
  });

  it('should handle invalid field names gracefully when fields param is used', () => {
    const data = { name: 'John', age: 25, email: 'john@example.com' };

    // Pass a field name that doesn't exist in the schema
    // Expect validation to succeed (as it ignores unknown fields)
    const result = validator.validate(notification, data, ['nonexistent']);

    expect(result).toBe(true);
    expect(notification.hasErrors()).toBe(false);
    expect(validator.errors).toBeNull();
  });
});
