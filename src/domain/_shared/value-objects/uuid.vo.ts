import { ValueObject } from '../value-object';
import { v4 as uuidv4, validate } from 'uuid';

export class Uuid extends ValueObject {
  readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id || uuidv4();
    this.validateUuid();
  }

  validateUuid(): boolean {
    const isValid = validate(this.id);
    if (!isValid) {
      throw new InvalidUuidError(`Invalid UUID: ${this.id}`);
    }
    return isValid;
  }

  toString(): string {
    return this.id;
  }
}

export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || 'ID must be a valid UUID');
    this.name = 'InvalidUuidError';
  }
}
