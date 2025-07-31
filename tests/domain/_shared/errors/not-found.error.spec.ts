// not-found-error.spec.ts

import type { Entity } from '../../../../src/domain/_shared/entity';
import { EntityNotFoundError } from '../../../../src/domain/_shared/errors/entity-not-found.error';
import { Notification } from '../../../../src/domain/_shared/validators/notification';
import type { ValueObject } from '../../../../src/domain/_shared/value-object';

class FakeEntity implements Entity {
  notification: Notification = new Notification();
  get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }
  toJSON(): unknown {
    throw new Error('Method not implemented.');
  }
  // implement minimally if needed
}

describe('NotFoundError', () => {
  it('should create an error with a single ID', () => {
    const error = new EntityNotFoundError(123, FakeEntity);

    expect(error).toBeInstanceOf(EntityNotFoundError);
    expect(error.name).toBe('EntityNotFoundError');
    expect(error.message).toBe('FakeEntity Not Found using ID 123');
  });

  it('should create an error with multiple IDs', () => {
    const error = new EntityNotFoundError([1, 2, 3], FakeEntity);

    expect(error).toBeInstanceOf(EntityNotFoundError);
    expect(error.name).toBe('EntityNotFoundError');
    expect(error.message).toBe('FakeEntity Not Found using ID 1, 2, 3');
  });

  it('should preserve the prototype chain', () => {
    const error = new EntityNotFoundError('abc', FakeEntity);
    expect(error).toBeInstanceOf(Error);
    expect(error instanceof EntityNotFoundError).toBe(true);
  });

  it('should create an error with empty array IDs', () => {
    const error = new EntityNotFoundError([], FakeEntity);
    expect(error).toBeInstanceOf(EntityNotFoundError);
    expect(error.message).toBe('FakeEntity Not Found using ID ');
  });

  it('should create an error when id is null', () => {
    const error = new EntityNotFoundError(null as any, FakeEntity);
    expect(error).toBeInstanceOf(EntityNotFoundError);
    expect(error.message).toBe('FakeEntity Not Found using ID null');
  });

  it('should create an error when id is undefined', () => {
    const error = new EntityNotFoundError(undefined as any, FakeEntity);
    expect(error).toBeInstanceOf(EntityNotFoundError);
    expect(error.message).toBe('FakeEntity Not Found using ID undefined');
  });
});
