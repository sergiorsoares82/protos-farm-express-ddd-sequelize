// search-result.spec.ts

import { Entity } from '../../../../src/domain/_shared/entity';
import { SearchResult } from '../../../../src/domain/_shared/repository/search-results';
import type { ValueObject } from '../../../../src/domain/_shared/value-object';

class FakeEntity extends Entity {
  get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }
  constructor(public id: number) {
    super();
  }
  toJSON() {
    return { id: this.id };
  }
}

describe('SearchResult', () => {
  it('should create a SearchResult with normalized values', () => {
    const result = new SearchResult({
      items: [new FakeEntity(1)],
      total: 10,
      current_page: 2,
      per_page: 5,
    });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(10);
    expect(result.current_page).toBe(2);
    expect(result.per_page).toBe(5);
    expect(result.last_page).toBe(2);
  });

  it('should normalize total to 0 when negative', () => {
    const result = new SearchResult({
      items: [],
      total: -5,
      current_page: 1,
      per_page: 5,
    });
    expect(result.total).toBe(0);
    expect(result.last_page).toBe(1);
  });

  it('should normalize per_page to at least 1 when <= 0', () => {
    const result = new SearchResult({
      items: [],
      total: 10,
      current_page: 1,
      per_page: 0,
    });
    expect(result.per_page).toBe(1);
  });

  it('should normalize current_page to 1 when less than 1', () => {
    const result = new SearchResult({
      items: [],
      total: 10,
      current_page: -5,
      per_page: 5,
    });
    expect(result.current_page).toBe(1);
  });

  it('should normalize current_page to last_page when greater than last_page', () => {
    const result = new SearchResult({
      items: [],
      total: 10,
      current_page: 999,
      per_page: 5,
    });
    expect(result.current_page).toBe(result.last_page);
  });

  it('should serialize to JSON without mapping entities when forceEntity is false', () => {
    const entity = new FakeEntity(1);
    const result = new SearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 10,
    });

    const json = result.toJSON();
    expect(json.items).toEqual([entity]);
    expect(json.total).toBe(1);
    expect(json.current_page).toBe(1);
    expect(json.per_page).toBe(10);
    expect(json.last_page).toBe(1);
  });

  it('should serialize to JSON mapping entities when forceEntity is true', () => {
    const entity = new FakeEntity(1);
    const result = new SearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 10,
    });

    const json = result.toJSON(true);
    expect(json.items).toEqual([{ id: 1 }]);
  });

  it('should create an empty SearchResult using factory', () => {
    const empty = SearchResult.empty(20);
    expect(empty.items).toEqual([]);
    expect(empty.total).toBe(0);
    expect(empty.current_page).toBe(1);
    expect(empty.per_page).toBe(20);
    expect(empty.last_page).toBe(1);
  });

  it('should use default parameter (forceEntity = false) in toJSON', () => {
    const entity = new FakeEntity(1);
    const result = new SearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 10,
    });
    const json = result.toJSON(); // no parameter
    expect(json.items).toEqual([entity]); // default behavior
  });

  it('should handle toJSON with forceEntity = true and empty items', () => {
    const result = new SearchResult({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 10,
    });
    const json = result.toJSON(true);
    expect(json.items).toEqual([]); // should remain empty
  });
});
