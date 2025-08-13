import type { ISearchableRepository } from '../_shared/repository/repository-interface';
import { SearchParams } from '../_shared/repository/search-params';
import { SearchResult } from '../_shared/repository/search-results';
import type { Uuid } from '../_shared/value-objects/uuid.vo';
import type { PersonEntity } from './person.entity';

export type PersonFilter = string;

export class PersonSearchParams extends SearchParams<PersonFilter> {}
export class PersonSearchResult extends SearchResult<PersonEntity> {}

export interface IPersonRepository
  extends ISearchableRepository<
    PersonEntity,
    Uuid,
    PersonFilter,
    PersonSearchParams,
    PersonSearchResult
  > {
  search(params: PersonSearchParams): Promise<PersonSearchResult>;
  existsByName(name: string, person_id?: Uuid): Promise<boolean>;
  existsByDocumentNumber(
    documentNumber: string,
    person_id?: Uuid,
  ): Promise<boolean>;
}
