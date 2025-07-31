import { Uuid } from '../../../src/domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../src/domain/user/user.entity';

describe('User Entity Unit Test', () => {
  let validateSpy: jest.SpyInstance;

  beforeEach(() => {
    validateSpy = jest.spyOn(UserEntity, 'validate');
  });

  afterEach(() => {
    validateSpy.mockRestore(); // <- Adicione isso aqui
  });
  describe('Constructor', () => {
    it('should create a user with required properties', () => {
      const user = new UserEntity({
        username: 'John Doe',
        email: 'john.doe@gmail.com',
        password: 'secure_password',
      });
      expect(user.username).toBe('John Doe');
      expect(user.email).toBe('john.doe@gmail.com');
      expect(user.password).toBe('secure_password');
      expect(user.is_active).toBe(true);
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    it('should create a user with optional properties', () => {
      const now = new Date();
      const user = new UserEntity({
        user_id: new Uuid(),
        username: 'Jane Doe',
        email: 'john.doe@gmail.com',
        password: 'secure_password',
        is_active: false,
        created_at: now,
        updated_at: now,
      });

      expect(user).toStrictEqual(
        new UserEntity({
          user_id: user.user_id,
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

      expect(user.user_id).toBeInstanceOf(Uuid);
      expect(user.username).toBe('Alice');
      expect(user.email).toBe('alice@gmail.com');
      expect(user.password).toBe('secure_password');
      expect(user.is_active).toBe(true);
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);

      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('should create a user using all props', () => {
      const user = UserEntity.create({
        username: 'Bob',
        email: 'bob@gmail.com',
        password: 'secure_password',
        is_active: false,
      });

      expect(user.user_id).toBeInstanceOf(Uuid);
      expect(user.username).toBe('Bob');
      expect(user.email).toBe('bob@gmail.com');
      expect(user.password).toBe('secure_password');
      expect(user.is_active).toBe(false);
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);

      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('Operations', () => {
    it('should change username', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      expect(validateSpy).toHaveBeenCalledTimes(1);

      user.changeUsername('Alice Smith');
      expect(user.username).toBe('Alice Smith');
      expect(user.updated_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    it('should change email', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      expect(validateSpy).toHaveBeenCalledTimes(1);

      user.changeEmail('alice_updated@gmail.com');
      expect(user.email).toBe('alice_updated@gmail.com');
      expect(user.updated_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    it('should change password', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      expect(validateSpy).toHaveBeenCalledTimes(1);

      user.changePassword('new_secure_password');
      expect(user.password).toBe('new_secure_password');
      expect(user.updated_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    it('should deactivate user', () => {
      const user = UserEntity.create({
        username: 'Alice',
        email: 'alice@gmail.com',
        password: 'secure_password',
      });

      expect(validateSpy).toHaveBeenCalledTimes(1);

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

      expect(validateSpy).toHaveBeenCalledTimes(1);

      user.activate();
      expect(user.is_active).toBe(true);
      expect(user.updated_at).toBeInstanceOf(Date);
    });
  });
  describe('user_id field', () => {
    const arrange = [
      {
        user_id: new Uuid(),
      },
      {
        user_id: null,
      },
      {
        user_id: undefined,
      },
    ];

    test.each(arrange)('id = %j', ({ user_id }) => {
      const user = new UserEntity({
        user_id: user_id as Uuid,
        username: 'john_doe',
        email: 'john.doe@gmail.com',
        password: 'secure_password',
      });
      expect(user.user_id).toBeInstanceOf(Uuid);
      if (user_id instanceof Uuid) {
        expect(user.user_id).toBe(user_id);
      }
    });
  });
  describe('UserValidator', () => {
    describe('create', () => {
      it('should invalidate empty username', () => {
        const user = UserEntity.create({
          username: '',
          email: 'alice@gmail.com',
          password: 'secure_password',
        });

        expect(user.notification.hasErrors()).toBe(true);
        expect(user.notification.getErrors('username')).toContain(
          'Username must be at least 3 characters',
        );
      });
      it('should invalidate username longer than 50 characters', () => {
        const user = UserEntity.create({
          username: 'a'.repeat(51),
          email: 'alice@gmail.com',
          password: 'secure_password',
        });

        expect(user.notification.hasErrors()).toBe(true);
        expect(user.notification.getErrors('username')).toContain(
          'String must contain at most 50 character(s)',
        );
      });
      it('should invalidate empty email', () => {
        const user = UserEntity.create({
          username: 'Alice',
          email: '',
          password: 'secure_password',
        });

        expect(user.notification.hasErrors()).toBe(true);
        expect(user.notification.getErrors('email')).toContain(
          'Invalid email address',
        );
      });
      it('should invalidate invalid email format', () => {
        const user = UserEntity.create({
          username: 'Alice',
          email: 'invalid-email',
          password: 'secure_password',
        });

        expect(user.notification.hasErrors()).toBe(true);
        expect(user.notification.getErrors('email')).toContain(
          'Invalid email address',
        );
      });
      it('should invalidate empty password', () => {
        const user = UserEntity.create({
          username: 'Alice',
          email: 'alice@gmail.com',
          password: '',
        });

        expect(user.notification.hasErrors()).toBe(true);
        expect(user.notification.getErrors('password')).toContain(
          'Password must be at least 6 characters',
        );
      });
      it('should invalidate password shorter than 6 characters', () => {
        const user = UserEntity.create({
          username: 'Alice',
          email: 'alice@gmail.com',
          password: '12345',
        });

        expect(user.notification.hasErrors()).toBe(true);
        expect(user.notification.getErrors('password')).toContain(
          'Password must be at least 6 characters',
        );
      });
      it('should invalidate password longer than 100 characters', () => {
        const user = UserEntity.create({
          username: 'Alice',
          email: 'alice@gmail.com',
          password: 'a'.repeat(101),
        });

        expect(user.notification.hasErrors()).toBe(true);
        expect(user.notification.getErrors('password')).toContain(
          'String must contain at most 100 character(s)',
        );
      });
      it('should create a valid user', () => {
        const user = UserEntity.create({
          username: 'Alice',
          email: 'alice@gmail.com',
          password: 'secure_password',
        });

        expect(user.notification.hasErrors()).toBe(false);
        expect(user.username).toBe('Alice');
        expect(user.email).toBe('alice@gmail.com');
        expect(user.password).toBe('secure_password');
        expect(user.is_active).toBe(true);
        expect(user.created_at).toBeInstanceOf(Date);
        expect(user.updated_at).toBeInstanceOf(Date);
      });
      it('should create a valid user with optional properties', () => {
        const user = UserEntity.create({
          username: 'Bob',
          email: 'bob@gmail.com',
          password: 'secure_password',
          is_active: false,
        });

        expect(user.notification.hasErrors()).toBe(false);
        expect(user.username).toBe('Bob');
        expect(user.email).toBe('bob@gmail.com');
        expect(user.password).toBe('secure_password');
        expect(user.is_active).toBe(false);
        expect(user.created_at).toBeInstanceOf(Date);
        expect(user.updated_at).toBeInstanceOf(Date);
      });
      it('toJSON should return correct plain object representation', () => {
        const user = UserEntity.create({
          username: 'Alice',
          email: 'alice@gmail.com',
          password: 'secure_password',
        });

        const json = user.toJSON();

        expect(json).toMatchObject({
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          password: user.password,
          is_active: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at,
        });
      });
    });
  });
});
