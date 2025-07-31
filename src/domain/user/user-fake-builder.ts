import type { Uuid } from '../_shared/value-objects/uuid.vo';
import { UserEntity } from './user.entity';
import Chance from 'chance';

type PropOrFactory<T> = T | ((index: number) => T);

export class UserFakeBuilder<TBuild = UserEntity | UserEntity[]> {
  private _user_id: PropOrFactory<Uuid> | undefined = undefined;
  private _username: PropOrFactory<string> = () => this.chance.name();
  private _email: PropOrFactory<string> = () => this.chance.email();
  private _password: PropOrFactory<string> = () =>
    this.chance.string({ length: 10 });
  private _is_active: PropOrFactory<boolean> = () => this.chance.bool();
  private _created_at: PropOrFactory<Date> | undefined = undefined;
  private _updated_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;
  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withUserId(userId: PropOrFactory<Uuid>) {
    this._user_id = userId;
    return this;
  }

  withUsername(username: PropOrFactory<string>) {
    this._username = username;
    return this;
  }

  withEmail(email: PropOrFactory<string>) {
    this._email = email;
    return this;
  }

  withPassword(password: PropOrFactory<string>) {
    this._password = password;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  withCreatedAt(createdAt: PropOrFactory<Date>) {
    this._created_at = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: PropOrFactory<Date>) {
    this._updated_at = updatedAt;
    return this;
  }

  withInvalidNameTooShort(value?: string) {
    this._username = value ?? this.chance.string({ length: 2 });
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._username = value ?? this.chance.string({ length: 51 });
    return this;
  }

  static aUser() {
    return new UserFakeBuilder<UserEntity>();
  }

  static theUsers(countObjs: number) {
    return new UserFakeBuilder<UserEntity[]>(countObjs);
  }

  build(): TBuild {
    const users: UserEntity[] = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const user = new UserEntity({
          user_id: !this._user_id
            ? undefined
            : this.callFactory(this._user_id, index),
          username: this.callFactory(this._username, index),
          email: this.callFactory(this._email, index),
          password: this.callFactory(this._password, index),
          is_active: this.callFactory(this._is_active, index),
          ...(this._created_at && {
            created_at: this.callFactory(this._created_at, index),
          }),
          ...(this._updated_at && {
            updated_at: this.callFactory(this._updated_at, index),
          }),
        });
        return user;
      });

    return (this.countObjs === 1 ? users[0] : users) as TBuild;
  }

  get userId() {
    return this.getValue('user_id');
  }

  get username() {
    return this.getValue('username');
  }

  get email() {
    return this.getValue('email');
  }

  get password() {
    return this.getValue('password');
  }

  get isActive() {
    return this.getValue('is_active');
  }

  get created_at() {
    return this.getValue('created_at');
  }

  get updated_at() {
    return this.getValue('updated_at');
  }

  private getValue(prop: any) {
    const optionalProperties = ['user_id', 'created_at', 'updated_at'];
    const privateProperties = `_${prop}` as keyof this;
    if (optionalProperties.includes(prop) && !this[privateProperties]) {
      throw new Error(
        `Property ${prop} is not set. Use with${prop.charAt(0).toUpperCase() + prop.slice(1)} method to set it.`,
      );
    }
    return this.callFactory(this[privateProperties], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
