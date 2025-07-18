import type { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../domain/user/user.entity';
import { InMemoryRepository } from '../in-memory.repository';

export class UserInMemoryRepository extends InMemoryRepository<
  UserEntity,
  Uuid
> {
  getEntity(): new (...args: any[]) => UserEntity {
    return UserEntity;
  }
}
