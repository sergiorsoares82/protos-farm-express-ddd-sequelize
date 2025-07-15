import { IsNotEmpty, MaxLength } from 'class-validator';
import type { UserEntity } from './user.entity';
import { ClassValidatorFields } from '../_shared/validators/class-validator-fields';

export class UserRules {
  @MaxLength(50)
  @IsNotEmpty()
  username: string;

  @MaxLength(100)
  email: string;

  @MaxLength(100)
  password: string;

  constructor({ username, email, password }: UserEntity) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(user: UserEntity): boolean {
    return super.validate(new UserRules(user));
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
