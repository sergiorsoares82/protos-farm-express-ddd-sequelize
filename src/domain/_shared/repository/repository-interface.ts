import type { Entity } from '../entity';
import type { ValueObject } from '../value-object';
import type { SearchParams } from './search-params';
import type { SearchResult } from './search-results';
import type { ITransaction } from './transaction.interface';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E, transaction: ITransaction): Promise<void>;
  bulkInsert(entities: E[], transaction: ITransaction): Promise<void>;
  update(entity: E, transaction: ITransaction): Promise<void>;
  delete(entity_id: EntityId, transaction: ITransaction): Promise<void>;

  findById(entity_id: EntityId, transaction?: ITransaction): Promise<E | null>;
  findAll(transaction: ITransaction): Promise<E[]>;

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
