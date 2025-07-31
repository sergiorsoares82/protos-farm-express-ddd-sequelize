import { z } from 'zod';
import { Entity } from '../_shared/entity';
import { Uuid } from '../_shared/value-objects/uuid.vo';
import { UserValidatorFactory } from './user.validator';

type UserConstructorProps = {
  user_id?: Uuid;
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

// --- Base schema (for creation) ---
export const UserBaseSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100),
  is_active: z.boolean().optional().default(true),
});

// --- Full schema (for entity validation) ---
export const UserFullSchema = UserBaseSchema.extend({
  user_id: z.instanceof(Uuid).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Input type for creation
export type UserCreateProps = z.input<typeof UserBaseSchema>;

export class UserEntity extends Entity {
  _user_id: Uuid;
  _username: string;
  _email: string;
  _password: string;
  _is_active: boolean;
  _created_at: Date;
  _updated_at: Date;

  constructor(props: UserConstructorProps) {
    super();
    this._user_id = props.user_id ?? new Uuid();
    this._username = props.username;
    this._email = props.email;
    this._password = props.password;
    this._is_active = props.is_active ?? true;
    this._created_at = props.created_at ?? new Date();
    this._updated_at = props.updated_at ?? new Date();
    UserEntity.validate(this);
  }

  get entity_id(): Uuid {
    return this._user_id;
  }

  get user_id(): Uuid {
    return this._user_id;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get is_active(): boolean {
    return this._is_active;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  // --- Factory for safe creation ---
  static create(props: UserCreateProps): UserEntity {
    const user = new UserEntity(props);
    // UserEntity.validate(user);
    return user;
  }

  // --- Update methods (always revalidate & touch updated_at) ---
  changeUsername(newUsername: string): void {
    this._username = newUsername;
    this.touch();
    UserEntity.validate(this);
  }

  changeEmail(newEmail: string): void {
    this._email = newEmail;
    this.touch();
    UserEntity.validate(this);
  }

  changePassword(newPassword: string): void {
    this._password = newPassword;
    this.touch();
    UserEntity.validate(this);
  }

  deactivate(): void {
    this._is_active = false;
    this.touch();
  }

  activate(): void {
    this._is_active = true;
    this.touch();
  }

  private touch(): void {
    this._updated_at = new Date();
  }

  // --- Full entity validation ---
  static validate(user: UserEntity): boolean {
    const validator = UserValidatorFactory.create();
    // const notification = new Notification();
    return validator.validate(user.notification, user);
  }

  toJSON(): UserConstructorProps {
    return {
      user_id: this._user_id,
      username: this._username,
      email: this._email,
      password: this._password,
      is_active: this._is_active,
      created_at: this._created_at,
      updated_at: this._updated_at,
    };
  }
}
