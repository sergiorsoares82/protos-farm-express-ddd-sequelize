import { Entity } from '../../../src/domain/_shared/entity';
import type { ValueObject } from '../../../src/domain/_shared/value-object';
import { Uuid } from '../../../src/domain/_shared/value-objects/uuid.vo';

class TestEntity extends Entity {
  private _id: Uuid;

  constructor(
    id: string,
    private data: any,
  ) {
    super();
    this._id = new Uuid(id);
  }

  get entity_id(): ValueObject {
    return this._id;
  }

  toJSON() {
    return { id: this._id.toString(), ...this.data };
  }
}

describe('Entity (abstract)', () => {
  it('should expose entity_id', () => {
    const uuid = new Uuid();
    const entity = new TestEntity(uuid.toString(), { name: 'John' });
    expect(entity.entity_id.toString()).toBe(uuid.toString());
  });

  it('should serialize to JSON', () => {
    const uuid = new Uuid();
    const entity = new TestEntity(uuid.toString(), { name: 'John' });
    expect(entity.toJSON()).toEqual({ id: uuid.toString(), name: 'John' });
  });
});
