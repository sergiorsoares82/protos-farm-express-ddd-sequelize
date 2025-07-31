import {
  InvalidUuidError,
  Uuid,
} from '../../../../src/domain/_shared/value-objects/uuid.vo';
import { validate as uuidValidate } from 'uuid';

describe('Uuid', () => {
  it('should generate a valid UUID if no id is provided', () => {
    const uuid = new Uuid();
    expect(uuidValidate(uuid.toString())).toBe(true);
  });

  it('should accept a valid UUID string', () => {
    const validId = '123e4567-e89b-12d3-a456-426614174000';
    const uuid = new Uuid(validId);
    expect(uuid.toString()).toBe(validId);
  });

  it('should throw InvalidUuidError for invalid UUID string', () => {
    const invalidId = 'invalid-uuid';
    expect(() => new Uuid(invalidId)).toThrow(InvalidUuidError);
    expect(() => new Uuid(invalidId)).toThrow(`Invalid UUID: ${invalidId}`);
  });

  it('validateUuid returns true for a valid UUID', () => {
    const uuid = new Uuid();
    expect(uuid.validateUuid()).toBe(true);
  });

  it('toString returns the UUID string', () => {
    const uuid = new Uuid();
    expect(uuid.toString()).toBe(uuid.id);
  });

  it('should throw InvalidUuidError with default message if no message passed', () => {
    try {
      throw new InvalidUuidError();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidUuidError);
      if (e instanceof Error) {
        expect(e.message).toBe('ID must be a valid UUID');
      }
    }
  });

  it('should keep the same id when a valid UUID is provided', () => {
    const validId = '123e4567-e89b-12d3-a456-426614174000';
    const uuid = new Uuid(validId);
    expect(uuid.id).toBe(validId);
  });

  it('should generate different UUIDs on multiple instances without params', () => {
    const uuid1 = new Uuid();
    const uuid2 = new Uuid();
    expect(uuid1.toString()).not.toBe(uuid2.toString());
  });
});
