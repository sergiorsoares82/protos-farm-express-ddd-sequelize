import type { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../domain/user/user.entity';
import { InMemoryRepository } from '../../database/in-memory/in-memory.repository';

export class InMemoryUsersRepository extends InMemoryRepository<
  UserEntity,
  Uuid
> {
  getEntity(): new (...args: any[]) => UserEntity {
    return UserEntity;
  }
}
