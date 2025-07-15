import { EntityValidationError } from '../../../src/domain/_shared/validators/validation.error';
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

      expect(user).toStrictEqual(
        new UserEntity({
          user_id: user.user_id,
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

      expect(user).toStrictEqual(
        new UserEntity({
          user_id: user.user_id,
          username: 'Alice',
          email: 'alice@gmail.com',
          password: 'secure_password',
          is_active: true,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      );
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
          user_id: user.user_id,
          username: 'Bob',
          email: 'bob@gmail.com',
          password: 'secure_password',
          is_active: false,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      );
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
      it('should create a UserValidator instance', () => {
        expect(() => {
          UserEntity.create({
            username: '',
            email: '',
            password: '',
          });
        }).toThrow(
          new EntityValidationError({
            name: ['name is required'],
          }),
        );
      });
    });
  });
});
