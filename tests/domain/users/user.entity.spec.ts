import { UserEntity } from '../../../src/domain/user/user.entity';

describe('User Entity Unit Test', () => {
  describe('Constructor', () => {
    it('should create a user with required properties', () => {
      const user = new UserEntity({
        username: 'John Doe',
        email: 'john.doe@gmail.com',
        password: 'secure_password',
      });

      expect(user).toStrictEqual(
        new UserEntity({
          id: expect.any(String),
          username: 'John Doe',
          email: 'john.doe@gmail.com',
          password: 'secure_password',
          is_active: true,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      );
    });

    it('should create a user with optional properties', () => {
      const now = new Date();
      const user = new UserEntity({
        id: '123',
        username: 'Jane Doe',
        email: 'john.doe@gmail.com',
        password: 'secure_password',
        is_active: false,
        created_at: now,
        updated_at: now,
      });

      expect(user).toStrictEqual(
        new UserEntity({
          id: '123',
          username: 'Jane Doe',
          email: 'john.doe@gmail.com',
          password: 'secure_password',
          is_active: false,
          created_at: now,
          updated_at: now,
        }),
      );
    });
  });
  describe('Create static method', () => {
    it('should create a user using required props', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      expect(user).toStrictEqual(
        new UserEntity({
          id: expect.any(String),
          username: 'Alice',
          email: 'alice@gmail.com',
          password: 'secure_password',
          is_active: true,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      );
    });

    it('should create a user using all props', () => {
      const user = UserEntity.create({
        username: 'Bob',
        email: 'bob@gmail.com',
        password: 'secure_password',
        is_active: false,
      });
      expect(user).toStrictEqual(
        new UserEntity({
          id: expect.any(String),
          username: 'Bob',
          email: 'bob@gmail.com',
          password: 'secure_password',
          is_active: false,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      );
    });
  });

  describe('Operations', () => {
    it('should change username', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      user.changeUsername('Alice Smith');
      expect(user.username).toBe('Alice Smith');
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    it('should change email', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      user.changeEmail('alice_updated@gmail.com');
      expect(user.email).toBe('alice_updated@gmail.com');
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    it('should change password', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      user.changePassword('new_secure_password');
      expect(user.password).toBe('new_secure_password');
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    it('should deactivate user', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      user.deactivate();
      expect(user.is_active).toBe(false);
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    it('should activate user', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
        is_active: false,
      });

      user.activate();
      expect(user.is_active).toBe(true);
      expect(user.updated_at).toBeInstanceOf(Date);
    });
  });
});
