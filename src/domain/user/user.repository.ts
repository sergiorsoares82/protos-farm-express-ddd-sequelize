import type { ISearchableRepository } from '../_shared/repository/repository-interface';
import { SearchParams } from '../_shared/repository/search-params';
import { SearchResult } from '../_shared/repository/search-results';
import type { ITransaction } from '../_shared/repository/transaction.interface';
import type { Uuid } from '../_shared/value-objects/uuid.vo';
import type { UserEntity } from './user.entity';

export type UserFilter = string;

export class UserSearchParams extends SearchParams<UserFilter> {}
export class UserSearchResult extends SearchResult<UserEntity> {}

export interface IUserRepository
  extends ISearchableRepository<
    UserEntity,
    Uuid,
    UserFilter,
    UserSearchParams,
    UserSearchResult
  > {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByPersonId(
    personId: Uuid,
    transaction: ITransaction,
  ): Promise<UserEntity | null>;
  search(params: UserSearchParams): Promise<UserSearchResult>;
}
