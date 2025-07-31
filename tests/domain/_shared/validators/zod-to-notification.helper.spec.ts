import type { ZodError } from 'zod';
import { Notification } from '../../../../src/domain/_shared/validators/notification';
import { addZodErrorsToNotification } from '../../../../src/domain/_shared/validators/zod-to-notification.helper';

describe('addZodErrorsToNotification', () => {
  let notification: Notification;

  beforeEach(() => {
    notification = new Notification();
  });

  it('should add errors from ZodError to the notification with proper paths', () => {
    const zodError = {
      errors: [
        { message: 'Name is required', path: ['name'] },
        { message: 'Age must be a number', path: ['age'] },
        { message: 'Invalid value', path: [] },
      ],
    } as unknown as ZodError<any>;

    addZodErrorsToNotification(zodError, notification);

    expect(notification.getErrors('name')).toEqual(['Name is required']);
    expect(notification.getErrors('age')).toEqual(['Age must be a number']);
    expect(notification.getErrors('root')).toEqual(['Invalid value']);
  });

  it('should handle numeric path segments correctly by joining with dot', () => {
    const zodError = {
      errors: [
        { message: 'Invalid element', path: ['items', 0] },
        { message: 'Missing field', path: ['data', 'field'] },
      ],
    } as unknown as ZodError<any>;

    addZodErrorsToNotification(zodError, notification);

    expect(notification.getErrors('items.0')).toEqual(['Invalid element']);
    expect(notification.getErrors('data.field')).toEqual(['Missing field']);
  });

  it('should do nothing if zodError has no errors', () => {
    const zodError = {
      errors: [],
    } as unknown as ZodError<any>;

    addZodErrorsToNotification(zodError, notification);

    expect(notification.hasErrors()).toBe(false);
  });

  it('should handle error objects with missing or undefined path by using "root"', () => {
    const zodError = {
      errors: [
        { message: 'Unknown error', path: undefined },
        { message: 'Another error' }, // path missing
      ],
    } as unknown as ZodError<any>;

    addZodErrorsToNotification(zodError, notification);

    expect(notification.getErrors('root')).toEqual([
      'Unknown error',
      'Another error',
    ]);
  });

  it('should skip errors with missing or empty message', () => {
    const zodError = {
      errors: [
        { message: '', path: ['field1'] },
        { path: ['field2'] }, // message missing
        { message: 'Valid error', path: ['field3'] },
      ],
    } as unknown as ZodError<any>;

    addZodErrorsToNotification(zodError, notification);

    expect(notification.getErrors('field1')).toEqual([]);
    expect(notification.getErrors('field2')).toEqual([]);
    expect(notification.getErrors('field3')).toEqual(['Valid error']);
    expect(notification.hasErrors()).toBe(true);
  });
});
