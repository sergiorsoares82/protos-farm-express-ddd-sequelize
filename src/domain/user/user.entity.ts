import z from 'zod';
import { Entity } from '../_shared/entity';
import { EntityValidationError } from '../_shared/validators/validation.error';
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

// Zod Schema for external input (DTO)
const UserCreateSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  is_active: z.boolean().optional().default(true),
});

export type UserCreateProps = z.infer<typeof UserCreateSchema>;

export class UserEntity extends Entity {
  user_id: Uuid;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(props: UserConstructorProps) {
    super();
    this.user_id = props.user_id ?? new Uuid();
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
    UserEntity.validate(this);
  }

  get entity_id(): Uuid {
    return this.user_id;
  }

  static create(props: UserCreateProps): UserEntity {
    const parsed = UserCreateSchema.parse(props);

    return new UserEntity(parsed);
  }

  changeUsername(newUsername: string): void {
    this.username = newUsername;
    this.updated_at = new Date();
    UserEntity.validate(this);
  }

  changeEmail(newEmail: string): void {
    this.email = newEmail;
    this.updated_at = new Date();
    this.touch();
    UserEntity.validate(this);
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
    this.touch();
    UserEntity.validate(this);
  }

  deactivate(): void {
    this.is_active = false;
    this.touch();
  }

  activate(): void {
    this.is_active = true;
    this.touch();
  }

  private touch(): void {
    this.updated_at = new Date();
  }

  static validate(user: UserEntity): boolean {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(user);
    if (!isValid) {
      throw new EntityValidationError(validator.errors ?? {});
    }
    return validator.validate(user);
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
