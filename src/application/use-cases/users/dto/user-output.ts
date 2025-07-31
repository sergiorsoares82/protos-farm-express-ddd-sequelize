import type { UserEntity } from '../../../../domain/user/user.entity';

export type UserOutput = {
  user_id: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export class UserOutputMapper {
  static toOutput(user: UserEntity): UserOutput {
    return {
      user_id: user.user_id.id,
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
