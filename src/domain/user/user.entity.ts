import { Uuid } from '../_shared/value-objects/uuid.vo';

type UserConstructorProps = {
  user_id?: Uuid;
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

type UserCreateProps = {
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
};

export class UserEntity {
  user_id: Uuid;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(props: UserConstructorProps) {
    this.user_id = props.user_id ?? new Uuid();
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  static create(props: UserCreateProps): UserEntity {
    return new UserEntity(props);
  }

  changeUsername(newUsername: string): void {
    this.username = newUsername;
    this.updated_at = new Date();
  }

  changeEmail(newEmail: string): void {
    this.email = newEmail;
    this.updated_at = new Date();
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
    this.updated_at = new Date();
  }

  deactivate(): void {
    this.is_active = false;
    this.updated_at = new Date();
  }

  activate(): void {
    this.is_active = true;
    this.updated_at = new Date();
  }

  toJSON(): UserConstructorProps {
    return {
      user_id: this.user_id,
      username: this.username,
      email: this.email,
      password: this.password,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
