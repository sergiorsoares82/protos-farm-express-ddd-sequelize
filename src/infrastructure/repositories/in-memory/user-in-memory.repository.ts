import type { SortDirection } from '../../../domain/_shared/repository/search-params';
import type { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../domain/user/user.entity';
import type { UserFilter } from '../../../domain/user/user.repository';
import { InMemorySearchableRepository } from '../in-memory.repository';

export class UserInMemoryRepository extends InMemorySearchableRepository<
  UserEntity,
  Uuid
> {
  sortableFields = ['username', 'email', 'created_at']; // <-- add this

  protected async applyFilter(
    items: UserEntity[],
    filter: UserFilter,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.username.toLowerCase().includes(filter.toLowerCase());
    });
  }
  getEntity(): new (...args: any[]) => UserEntity {
    return UserEntity;
  }

  protected applySort(
    items: UserEntity[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.items.find((item) => item.email === email);
    return Promise.resolve(user || null);
  }
}
