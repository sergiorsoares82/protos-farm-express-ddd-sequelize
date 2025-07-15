import type { IRepository } from '../_shared/repository/repository-interface';
import type { Uuid } from '../_shared/value-objects/uuid.vo';
import type { UserEntity } from './user.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUserRepository extends IRepository<UserEntity, Uuid> {}
