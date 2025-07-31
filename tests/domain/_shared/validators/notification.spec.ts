import { Notification } from '../../../../src/domain/_shared/validators/notification';

describe('Notification', () => {
  let notification: Notification;

  beforeEach(() => {
    notification = new Notification();
  });

  describe('addError', () => {
    it('should add an error without a field as a string entry', () => {
      notification.addError('Generic error');
      expect(notification.getErrors()).toEqual(['Generic error']);
    });

    it('should add an error for a specific field', () => {
      notification.addError('Field error', 'field1');
      expect(notification.getErrors('field1')).toEqual(['Field error']);
    });

    it('should not add duplicate errors for a field', () => {
      notification.addError('Field error', 'field1');
      notification.addError('Field error', 'field1');
      expect(notification.getErrors('field1')).toEqual(['Field error']);
    });

    it('should add multiple different errors to the same field', () => {
      notification.addError('Error1', 'field1');
      notification.addError('Error2', 'field1');
      expect(notification.getErrors('field1')).toEqual(['Error1', 'Error2']);
    });

    it('should overwrite a top-level string error when called again', () => {
      notification.addError('Error1');
      notification.addError('Error2'); // replaces previous top-level key
      expect(notification.getErrors()).toEqual(['Error1', 'Error2']);
    });

    it('should not duplicate top-level string errors when added twice', () => {
      notification.addError('Error1');
      notification.addError('Error1'); // duplicate same error
      expect(notification.getErrors()).toEqual(['Error1']);
    });

    it('should handle addError with existing field errors and add new unique error', () => {
      notification.addError('Error1', 'field1');
      notification.addError('Error2', 'field1'); // adds second error
      expect(notification.getErrors('field1')).toEqual(['Error1', 'Error2']);
    });

    it('should not add duplicate errors with addError for the same field', () => {
      notification.addError('Error1', 'field1');
      notification.addError('Error1', 'field1'); // duplicate ignored
      expect(notification.getErrors('field1')).toEqual(['Error1']);
    });

    it('should handle adding empty error string gracefully', () => {
      notification.addError('');
      expect(notification.getErrors()).toEqual(['']);
    });

    it('should not add duplicate top-level string errors when added twice', () => {
      notification.addError('Duplicate error');
      notification.addError('Duplicate error'); // duplicate ignored
      expect(notification.getErrors()).toEqual(['Duplicate error']);
    });

    it('should not add duplicate top-level string errors when added twice', () => {
      notification.addError('Duplicate error');
      notification.addError('Duplicate error'); // should not add again
      expect(notification.getErrors()).toEqual(['Duplicate error']);
    });
  });

  describe('setError', () => {
    it('should set an error for a field (single string)', () => {
      notification.setError('Single error', 'field1');
      expect(notification.getErrors('field1')).toEqual(['Single error']);
    });

    it('should overwrite errors for a field when setting a new one', () => {
      notification.setError('Old error', 'field1');
      notification.setError('New error', 'field1');
      expect(notification.getErrors('field1')).toEqual(['New error']);
    });

    it('should set multiple errors for a field', () => {
      notification.setError(['Error1', 'Error2'], 'field1');
      expect(notification.getErrors('field1')).toEqual(['Error1', 'Error2']);
    });

    it('should set multiple errors without field (top-level keys)', () => {
      notification.setError(['Error1', 'Error2']);
      expect(notification.getErrors()).toContain('Error1');
      expect(notification.getErrors()).toContain('Error2');
    });

    it('should set a single error without a field (top-level key)', () => {
      notification.setError('Generic error');
      expect(notification.getErrors()).toEqual(['Generic error']);
    });

    it('should set error with empty array without field (no-op)', () => {
      notification.setError([], undefined);
      expect(notification.getErrors()).toEqual([]);
      expect(notification.hasErrors()).toBe(false);
    });

    it('should set multiple top-level errors (array) correctly with setError', () => {
      notification.setError(['Err1', 'Err2']); // triggers forEach branch
      expect(notification.getErrors()).toEqual(
        expect.arrayContaining(['Err1', 'Err2']),
      );
    });

    it('should set multiple top-level errors with setError when error is array and no field', () => {
      notification.setError(['Err1', 'Err2']);
      expect(notification.getErrors()).toEqual(
        expect.arrayContaining(['Err1', 'Err2']),
      );
    });

    it('should set error with empty array without field (no-op)', () => {
      notification.setError([], undefined);
      expect(notification.getErrors()).toEqual([]);
      expect(notification.hasErrors()).toBe(false);
    });
  });

  describe('getErrors', () => {
    it('should return all errors when no field is provided', () => {
      notification.addError('Error1');
      notification.addError('Error2', 'field1');
      notification.addError('Error3', 'field2');
      expect(notification.getErrors()).toEqual(
        expect.arrayContaining(['Error1', 'Error2', 'Error3']),
      );
    });

    it('should return an empty array if field does not exist', () => {
      expect(notification.getErrors('nonexistent')).toEqual([]);
    });

    it('should return empty array for a field explicitly set then removed', () => {
      notification.setError('Error1', 'field1');
      notification.errors.delete('field1'); // simulate removal
      expect(notification.getErrors('field1')).toEqual([]);
    });
  });

  describe('hasErrors', () => {
    it('should return false when there are no errors', () => {
      expect(notification.hasErrors()).toBe(false);
    });

    it('should return true when there are errors', () => {
      notification.addError('Error1');
      expect(notification.hasErrors()).toBe(true);
    });
  });

  describe('copyErrors', () => {
    it('should copy errors from another notification', () => {
      const source = new Notification();
      source.setError(['Error1', 'Error2'], 'field1');
      source.addError('Top-level error');

      notification.copyErrors(source);

      expect(notification.getErrors('field1')).toEqual(['Error1', 'Error2']);
      expect(notification.getErrors()).toContain('Top-level error');
    });

    it('should copy errors with empty array and string correctly', () => {
      const source = new Notification();
      source.setError([], 'field1');
      source.setError('Top-level error');

      notification.copyErrors(source);

      expect(notification.getErrors('field1')).toEqual([]);
      expect(notification.getErrors()).toContain('Top-level error');
    });

    it('should correctly copy a top-level string error with field key', () => {
      const source = new Notification();
      source.setError('SingleError', 'field1');
      notification.copyErrors(source);
      expect(notification.getErrors('field1')).toEqual(['SingleError']);
    });

    it('should merge errors when copyErrors is called on non-empty notification', () => {
      notification.setError('Existing error', 'field1');
      const source = new Notification();
      source.setError('New error', 'field1');
      notification.copyErrors(source);
      expect(notification.getErrors('field1')).toEqual(['New error']);
    });

    it('should copy errors from an empty notification (no changes)', () => {
      const source = new Notification();
      notification.addError('Existing error');
      notification.copyErrors(source);
      expect(notification.getErrors()).toEqual(['Existing error']);
    });

    it('should copy multiple errors including top-level and field errors', () => {
      const source = new Notification();
      source.setError('TopError');
      source.setError(['FieldErr1', 'FieldErr2'], 'field1');

      notification.copyErrors(source);

      expect(notification.getErrors()).toContain('TopError');
      expect(notification.getErrors('field1')).toEqual([
        'FieldErr1',
        'FieldErr2',
      ]);
    });

    it('should handle copying errors from empty notification', () => {
      const emptyNotification = new Notification();
      notification.copyErrors(emptyNotification);
      expect(notification.hasErrors()).toBe(false);
    });
  });

  describe('errorsAsObject', () => {
    it('should return errors as an object with arrays', () => {
      notification.addError('Error1', 'field1');
      notification.addError('Generic error');
      const result = notification.errorsAsObject();
      expect(result).toEqual({
        field1: ['Error1'],
        'Generic error': ['Generic error'],
      });
    });

    it('should handle only top-level string errors', () => {
      notification.setError('JustOneError');
      const obj = notification.errorsAsObject();
      expect(obj).toEqual({ JustOneError: ['JustOneError'] });
    });

    it('should return empty object when no errors exist', () => {
      expect(notification.errorsAsObject()).toEqual({});
    });
  });

  describe('toJSON', () => {
    it('should return an array with string errors and objects for fields', () => {
      notification.addError('Error1');
      notification.addError('Field error', 'field1');
      const json = notification.toJSON();
      expect(json).toEqual(
        expect.arrayContaining(['Error1', { field1: ['Field error'] }]),
      );
    });

    it('should handle multiple field errors properly', () => {
      notification.setError(['E1', 'E2'], 'field1');
      notification.setError('Generic error');
      const json = notification.toJSON();
      expect(json).toContainEqual({ field1: ['E1', 'E2'] });
      expect(json).toContain('Generic error');
    });

    it('toJSON returns empty array when no errors', () => {
      expect(notification.toJSON()).toEqual([]);
    });

    it('should return only string errors when no field errors exist', () => {
      notification.addError('OnlyError');
      const json = notification.toJSON();
      expect(json).toEqual(['OnlyError']);
    });
  });
});
