import {
  InvalidUuidError,
  Uuid,
} from '../../../../src/domain/_shared/value-objects/uuid.vo';
import { validate as uuidValidate } from 'uuid';

describe('UUID Value Object Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as Uuid, 'validateUuid');

  it('should throw an error for invalid UUID', () => {
    expect(() => new Uuid('invalid-uuid')).toThrow(InvalidUuidError);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should create a valid UUID', () => {
    const uuid = new Uuid();
    expect(uuid).toBeInstanceOf(Uuid);
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should create a UUID from a valid string', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    const uuid = new Uuid(validUuid);
    expect(uuid.id).toBe(validUuid);
    expect(validateSpy).toHaveBeenCalled();
  });
});
