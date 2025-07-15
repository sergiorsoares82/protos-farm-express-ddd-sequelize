import type { UserEntity } from '../../../domain/user/user.entity';

export class InMemoryUsersRepository {
  private users: UserEntity[] = [];

  async create(user: UserEntity): Promise<UserEntity> {
    this.users.push(user);
    return user;
  }
}
