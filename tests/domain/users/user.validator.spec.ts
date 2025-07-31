import { UserFakeBuilder } from '../../../src/domain/user/user-fake-builder';
import { UserEntity } from '../../../src/domain/user/user.entity';

describe('UserValidator Unit Tests', () => {
  it('should validate a valid user', () => {
    const user = UserFakeBuilder.aUser().build();
    const isValid = UserEntity.validate(user);
    expect(isValid).toBe(true);
  });

  describe('username property', () => {
    it('should set an error when username is shorter than 3 characters', () => {
      const user = UserFakeBuilder.aUser()
        .withUsername('ab') // Invalid username
        .build();
      expect(user.notification.hasErrors()).toBe(true);
      expect(user.notification.getErrors('username')).toContain(
        'Username must be at least 3 characters',
      );
    });
    it('should set an error for a username longer than 50 characters', () => {
      const user = UserFakeBuilder.aUser()
        .withUsername('a'.repeat(51)) // Invalid username
        .build();
      expect(user.notification.hasErrors()).toBe(true);
      expect(user.notification.getErrors('username')).toContain(
        'String must contain at most 50 character(s)',
      );
    });

    it('should allow a valid username', () => {
      const user = UserFakeBuilder.aUser()
        .withUsername('Valid Username')
        .build();
      expect(user.username).toBe('Valid Username');
    });
  });
  describe('email property', () => {
    it('should set error for an invalid email format', () => {
      const user = UserFakeBuilder.aUser()
        .withEmail('invalid-email') // Invalid email
        .build();
      expect(user.notification.hasErrors()).toBe(true);
      expect(user.notification.getErrors('email')).toContain(
        'Invalid email address',
      );
    });
    it('should allow a valid email', () => {
      const user = UserFakeBuilder.aUser()
        .withEmail('valid.email@example.com')
        .build();
      expect(user.email).toBe('valid.email@example.com');
    });
  });
  describe('password property', () => {
    it('should set error for a password shorter than 6 characters', () => {
      const user = UserFakeBuilder.aUser()
        .withPassword('12345') // Invalid password
        .build();
      expect(user.notification.hasErrors()).toBe(true);
      expect(user.notification.getErrors('password')).toContain(
        'Password must be at least 6 characters',
      );
    });
    it('should set error for a password longer than 100 characters', () => {
      const user = UserFakeBuilder.aUser()
        .withPassword('a'.repeat(1000)) // Invalid password
        .build();
      expect(user.notification.hasErrors()).toBe(true);
      expect(user.notification.getErrors('password')).toContain(
        'String must contain at most 100 character(s)',
      );
    });
    it('should allow a valid password', () => {
      const user = UserFakeBuilder.aUser()
        .withPassword('ValidPassword123')
        .build();
      expect(user.password).toBe('ValidPassword123');
    });

    it('should allow a valid password', () => {
      const user = UserFakeBuilder.aUser()
        .withPassword('ValidPassword123')
        .build();
      expect(user.password).toBe('ValidPassword123');
    });
  });
});
