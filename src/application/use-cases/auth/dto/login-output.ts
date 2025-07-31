import type { UserEntity } from '../../../../domain/user/user.entity';

export type LoginOutput = {
  user_id: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  accessToken: string;
  refreshToken: string;
};

export class LoginOutputMapper {
  static toOutput(
    user: UserEntity,
    accessToken: string,
    refreshToken: string,
  ): LoginOutput {
    return {
      user_id: user.user_id.id,
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      accessToken,
      refreshToken,
    };
  }
}
