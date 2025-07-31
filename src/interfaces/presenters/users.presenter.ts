import type { UserOutput } from '../../application/use-cases/users/dto/user-output';
import type { SearchUsersOutput } from '../../application/use-cases/users/search-users.use-case';

export class UsersPresenter {
  user_id: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(user: UserOutput) {
    this.user_id = user.user_id;
    this.username = user.username;
    this.email = user.email;
    this.is_active = user.is_active;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }
}

export class UsersCollectionPresenter {
  data: UsersPresenter[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;

  constructor(output: SearchUsersOutput) {
    this.data = output.items.map((i) => new UsersPresenter(i));
    this.current_page = output.current_page;
    this.per_page = output.per_page;
    this.total = output.total;
    this.last_page = output.last_page;
  }
}
