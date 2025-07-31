import { Chance } from 'chance';
import { Uuid } from '../../../src/domain/_shared/value-objects/uuid.vo';
import { UserFakeBuilder } from '../../../src/domain/user/user-fake-builder';
import { UserEntity } from '../../../src/domain/user/user.entity';

describe('User Fake Builder Unit Test', () => {
  describe('user_id property', () => {
    const userBuilder = UserFakeBuilder.aUser();
    it('should throw an error when withUserId is not called', () => {
      expect(() => userBuilder.userId).toThrow(
        new Error(
          `Property user_id is not set. Use withUser_id method to set it.`,
        ),
      );
    });
    it('should be undefined when withUserId is not called', () => {
      expect(userBuilder['_user_id']).toBeUndefined();
    });
    it('should return the user_id when withUserId is called', () => {
      const user_id = new Uuid();
      const user = userBuilder.withUserId(user_id);
      expect(user).toBeInstanceOf(UserFakeBuilder);
      expect(user.userId).toBe(user_id);
      expect(userBuilder['_user_id']).toBe(user_id);

      userBuilder.withUserId(() => user_id);
      // @ts-expect-error user_id is a callable function
      expect(userBuilder['_user_id']()).toBe(user_id);
      expect(userBuilder.userId).toBe(user_id);
    });
    it('should pass index to user_id factory function', () => {
      let mockUserId = jest.fn(() => new Uuid());
      userBuilder.withUserId(mockUserId);
      userBuilder.build();
      expect(mockUserId).toHaveBeenCalledTimes(1);

      const userId = new Uuid();
      mockUserId = jest.fn(() => userId);
      const UserBuilderMany = UserFakeBuilder.theUsers(2);
      UserBuilderMany.withUserId(mockUserId);
      UserBuilderMany.build();
      expect(mockUserId).toHaveBeenCalledTimes(2);
      expect(UserBuilderMany.build()[0].user_id).toBe(userId);
      expect(UserBuilderMany.build()[1].user_id).toBe(userId);
    });
  });
  describe('username property', () => {
    const userBuilder = UserFakeBuilder.aUser();
    it('should be a function when withUsername is not called', () => {
      expect(userBuilder['_username']).toBeInstanceOf(Function);
    });

    describe('when withUsername is called', () => {
      it('should return the username when withUsername is called', () => {
        const username = 'test_user';
        const user = userBuilder.withUsername(username);
        expect(user).toBeInstanceOf(UserFakeBuilder);
        expect(user.username).toBe(username);
        expect(userBuilder['_username']).toBe(username);

        userBuilder.withUsername(() => username);
        // @ts-expect-error username is a callable function
        expect(userBuilder['_username']()).toBe(username);
        expect(userBuilder.username).toBe(username);
      });
      it('should pass index to username factory function', () => {
        userBuilder.withUsername((index: number) => `user_${index}`);
        const user = userBuilder.build();
        expect(user.username).toBe('user_0');

        const UserBuilderMany = UserFakeBuilder.theUsers(2);
        UserBuilderMany.withUsername((index: number) => `user_${index}`);
        const users = UserBuilderMany.build();
        expect(users[0].username).toBe('user_0');
        expect(users[1].username).toBe('user_1');
      });
      it('should create a too short username', () => {
        const user = userBuilder.withInvalidNameTooShort();
        expect(user).toBeInstanceOf(UserFakeBuilder);
        expect(userBuilder['_username'].length).toBe(2);

        const tooShortUser = userBuilder.withInvalidNameTooShort('ab');
        expect(tooShortUser).toBeInstanceOf(UserFakeBuilder);
        expect(userBuilder['_username'].length).toBe(2);
        expect(userBuilder['_username']).toBe('ab');
      });
      it('should create a too long username', () => {
        const user = userBuilder.withInvalidNameTooLong();
        expect(user).toBeInstanceOf(UserFakeBuilder);
        expect(userBuilder['_username'].length).toBe(51);

        const tooLongUser = userBuilder.withInvalidNameTooLong('a'.repeat(51));
        expect(tooLongUser).toBeInstanceOf(UserFakeBuilder);
        expect(userBuilder['_username'].length).toBe(51);
        expect(userBuilder['_username']).toBe('a'.repeat(51));
      });
    });
  });
  describe('email property', () => {
    const userBuilder = UserFakeBuilder.aUser();
    it('should be a function when withEmail is not called', () => {
      expect(userBuilder['_email']).toBeInstanceOf(Function);
    });

    describe('when withEmail is called', () => {
      it('should return the email when withEmail is called', () => {
        const email = 'test@example.com';
        const user = userBuilder.withEmail(email);
        expect(user).toBeInstanceOf(UserFakeBuilder);
        expect(user.email).toBe(email);
        expect(userBuilder['_email']).toBe(email);

        userBuilder.withEmail(() => email);
        // @ts-expect-error email is a callable function
        expect(userBuilder['_email']()).toBe(email);
        expect(userBuilder.email).toBe(email);
      });
      it('should pass index to email factory function', () => {
        userBuilder.withEmail((index: number) => `user_${index}@example.com`);
        const user = userBuilder.build();
        expect(user.email).toBe('user_0@example.com');

        const UserBuilderMany = UserFakeBuilder.theUsers(2);
        UserBuilderMany.withEmail(
          (index: number) => `user_${index}@example.com`,
        );
        const users = UserBuilderMany.build();
        expect(users[0].email).toBe('user_0@example.com');
        expect(users[1].email).toBe('user_1@example.com');
      });
    });
    it('should create a valid email', () => {
      const user = userBuilder.withEmail('test@example.com');
      expect(user).toBeInstanceOf(UserFakeBuilder);
      expect(userBuilder['_email']).toBe('test@example.com');
      expect(userBuilder.email).toBe('test@example.com');
      expect(userBuilder.build().email).toBe('test@example.com');
    });
  });
  describe('password property', () => {
    const userBuilder = UserFakeBuilder.aUser();
    it('should be a function when withPassword is not called', () => {
      expect(userBuilder['_password']).toBeInstanceOf(Function);
    });

    describe('when withPassword is called', () => {
      it('should return the password when withPassword is called', () => {
        const password = 'securepassword';
        const user = userBuilder.withPassword(password);
        expect(user).toBeInstanceOf(UserFakeBuilder);
        expect(user.password).toBe(password);
        expect(userBuilder['_password']).toBe(password);

        userBuilder.withPassword(() => password);
        // @ts-expect-error password is a callable function
        expect(userBuilder['_password']()).toBe(password);
        expect(userBuilder.password).toBe(password);
      });
      it('should pass index to password factory function', () => {
        userBuilder.withPassword((index: number) => `password_${index}`);
        const user = userBuilder.build();
        expect(user.password).toBe('password_0');

        const UserBuilderMany = UserFakeBuilder.theUsers(2);
        UserBuilderMany.withPassword((index: number) => `password_${index}`);
        const users = UserBuilderMany.build();
        expect(users[0].password).toBe('password_0');
        expect(users[1].password).toBe('password_1');
      });
    });
  });
  describe('is_active property', () => {
    const userBuilder = UserFakeBuilder.aUser();
    it('should be a function when withIsActive is not called', () => {
      expect(userBuilder['_is_active']).toBeInstanceOf(Function);
    });
    it('should activate user', () => {
      const user = userBuilder.activate();
      expect(user).toBeInstanceOf(UserFakeBuilder);
      expect(user.isActive).toBe(true);
      expect(userBuilder['_is_active']).toBe(true);
    });
    it('should deactivate user', () => {
      const user = userBuilder.deactivate();
      expect(user).toBeInstanceOf(UserFakeBuilder);
      expect(user.isActive).toBe(false);
      expect(userBuilder['_is_active']).toBe(false);
    });
  });
  describe('created_at property', () => {
    const userBuilder = UserFakeBuilder.aUser();
    it('should throw an error when withCreatedAt is not called', () => {
      expect(() => userBuilder.created_at).toThrow(
        new Error(
          `Property created_at is not set. Use withCreated_at method to set it.`,
        ),
      );
    });
    it('should be undefined when withCreatedAt is not called', () => {
      expect(userBuilder['_created_at']).toBeUndefined();
    });
    describe('when withCreatedAt is called', () => {
      it('should return the created_at when withCreatedAt is called', () => {
        const createdAt = new Date();
        const user = userBuilder.withCreatedAt(createdAt);
        expect(user).toBeInstanceOf(UserFakeBuilder);
        expect(user.created_at).toBe(createdAt);
        expect(userBuilder['_created_at']).toBe(createdAt);

        userBuilder.withCreatedAt(() => createdAt);
        // @ts-expect-error created_at is a callable function
        expect(userBuilder['_created_at']()).toBe(createdAt);
        expect(userBuilder.created_at).toBe(createdAt);
      });
      it('should pass index to created_at factory function', () => {
        userBuilder.withCreatedAt(
          (index: number) => new Date(2020, 0, index + 1),
        );
        const user = userBuilder.build();
        expect(user.created_at).toEqual(new Date(2020, 0, 1));

        const UserBuilderMany = UserFakeBuilder.theUsers(2);
        UserBuilderMany.withCreatedAt(
          (index: number) => new Date(2020, 0, index + 1),
        );
        const users = UserBuilderMany.build();
        expect(users[0].created_at).toEqual(new Date(2020, 0, 1));
        expect(users[1].created_at).toEqual(new Date(2020, 0, 2));
      });
    });
  });
  describe('updated_at property', () => {
    const userBuilder = UserFakeBuilder.aUser();
    it('should throw an error when withUpdatedAt is not called', () => {
      expect(() => userBuilder.updated_at).toThrow(
        new Error(
          `Property updated_at is not set. Use withUpdated_at method to set it.`,
        ),
      );
    });
    it('should be undefined when withUpdatedAt is not called', () => {
      expect(userBuilder['_updated_at']).toBeUndefined();
    });
    describe('when withUpdatedAt is called', () => {
      it('should return the updated_at when withUpdatedAt is called', () => {
        const updatedAt = new Date();
        const user = userBuilder.withUpdatedAt(updatedAt);
        expect(user).toBeInstanceOf(UserFakeBuilder);
        expect(user.updated_at).toBe(updatedAt);
        expect(userBuilder['_updated_at']).toBe(updatedAt);

        userBuilder.withUpdatedAt(() => updatedAt);
        // @ts-expect-error updated_at is a callable function
        expect(userBuilder['_updated_at']()).toBe(updatedAt);
        expect(userBuilder.updated_at).toBe(updatedAt);
      });
      it('should pass index to updated_at factory function', () => {
        userBuilder.withUpdatedAt(
          (index: number) => new Date(2020, 0, index + 1),
        );
        const user = userBuilder.build();
        expect(user.updated_at).toEqual(new Date(2020, 0, 1));

        const UserBuilderMany = UserFakeBuilder.theUsers(2);
        UserBuilderMany.withUpdatedAt(
          (index: number) => new Date(2020, 0, index + 1),
        );
        const users = UserBuilderMany.build();
        expect(users[0].updated_at).toEqual(new Date(2020, 0, 1));
        expect(users[1].updated_at).toEqual(new Date(2020, 0, 2));
      });
    });
  });
  describe('build method', () => {
    it('should create a single user when countObjs is 1', () => {
      const user = UserFakeBuilder.aUser().build();
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.username).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.password).toBeDefined();
      expect(user.is_active).toBeDefined();
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);

      const date = new Date();
      const uuid = new Uuid();
      const userWithProps = UserFakeBuilder.aUser()
        .withUserId(uuid)
        .withUsername('John Doe')
        .withEmail('john.doe@example.com')
        .withPassword('password123')
        .activate()
        .withCreatedAt(date)
        .withUpdatedAt(date);
      const builtUser = userWithProps.build();
      expect(builtUser.user_id).toBe(uuid);
      expect(builtUser.username).toBe('John Doe');
      expect(builtUser.email).toBe('john.doe@example.com');
      expect(builtUser.password).toBe('password123');
      expect(builtUser.is_active).toBe(true);
      expect(builtUser.created_at).toBe(date);
      expect(builtUser.updated_at).toBe(date);
      expect(builtUser).toBeInstanceOf(UserEntity);
    });

    it('should create multiple users when countObjs is greater than 1', () => {
      const users = UserFakeBuilder.theUsers(3).build();
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBe(3);
      users.forEach((user) => {
        expect(user).toBeInstanceOf(UserEntity);
        expect(user.username).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.password).toBeDefined();
        expect(user.is_active).toBeDefined();
        expect(user.created_at).toBeInstanceOf(Date);
        expect(user.updated_at).toBeInstanceOf(Date);
      });

      const date = new Date();
      const uuid = new Uuid();
      const usersWithProps = UserFakeBuilder.theUsers(2)
        .withUserId(uuid)
        .withUsername('Jane Doe')
        .withEmail('jane.doe@example.com')
        .withPassword('password123')
        .activate()
        .withCreatedAt(date)
        .withUpdatedAt(date);
      const builtUsers = usersWithProps.build();
      expect(builtUsers.length).toBe(2);
      builtUsers.forEach((user) => {
        expect(user.user_id).toBe(uuid);
        expect(user.username).toBe('Jane Doe');
        expect(user.email).toBe('jane.doe@example.com');
        expect(user.password).toBe('password123');
        expect(user.is_active).toBe(true);
        expect(user.created_at).toBe(date);
        expect(user.updated_at).toBe(date);
      });
    });
  });
  describe('chance library', () => {
    it('should be an instance of Chance', () => {
      const userBuilder = UserFakeBuilder.aUser();
      expect(userBuilder['chance']).toBeInstanceOf(Chance);
    });

    it('should generate random values for properties', () => {
      const user = UserFakeBuilder.aUser().build();
      expect(user.username).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.password).toBeDefined();
      expect(user.is_active).toBeDefined();
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
    });
  });
  describe('static methods', () => {
    it('should create a UserFakeBuilder instance with aUser', () => {
      const userBuilder = UserFakeBuilder.aUser();
      expect(userBuilder).toBeInstanceOf(UserFakeBuilder);
    });

    it('should create a UserFakeBuilder instance with theUsers', () => {
      const userBuilder = UserFakeBuilder.theUsers(2);
      expect(userBuilder).toBeInstanceOf(UserFakeBuilder);
      expect(userBuilder['countObjs']).toBe(2);
    });
  });
});
