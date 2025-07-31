import type { Entity } from '../entity';
import type { ValueObject } from '../value-object';
import type { SearchParams } from './search-params';
import type { SearchResult } from './search-results';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity_id: EntityId): Promise<void>;

  findById(entity_id: EntityId): Promise<E | null>;
  findAll(): Promise<E[]>;

  getEntity(): new (...args: []) => E;
}

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E>,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(params: SearchInput): Promise<SearchOutput>;
}
