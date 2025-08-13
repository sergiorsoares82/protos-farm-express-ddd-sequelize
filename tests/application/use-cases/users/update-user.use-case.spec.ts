import { UserOutputMapper } from '../../../../src/application/use-cases/users/dto/user-output';
import { UpdateUserUseCase } from '../../../../src/application/use-cases/users/update-user.use-case';
import { EntityNotFoundError } from '../../../../src/domain/_shared/errors/entity-not-found.error';
import { EntityValidationError } from '../../../../src/domain/_shared/validators/validation.error';
import { Uuid } from '../../../../src/domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../../src/domain/user/user.entity';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let userRepository: {
    findById: jest.Mock;
    findByEmail: jest.Mock;
    update: jest.Mock;
  };
  let existingUser: UserEntity;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    const validUuidString = '123e4567-e89b-12d3-a456-426614174000';

    existingUser = new UserEntity({
      user_id: new Uuid(validUuidString),
      username: 'old_username',
      email: 'old@example.com',
      password: 'old_password',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    useCase = new UpdateUserUseCase(userRepository as any);
  });

  it('should throw NotFoundError if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);
    const input = { user_id: '123e4567-e89b-12d3-a456-426614174000' };

    await expect(useCase.execute(input as any)).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  it('should throw error if email is already in use by another user', async () => {
    const anotherUser = new UserEntity({
      user_id: new Uuid('987e6543-e21b-12d3-a456-426614174999'),
      username: 'another',
      email: 'duplicate@example.com',
      password: 'pass',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(anotherUser);

    const input = {
      user_id: existingUser.entity_id.id,
      email: 'duplicate@example.com',
    };

    await expect(useCase.execute(input as any)).rejects.toThrow(
      `Email already in use`,
    );
  });

  it('should update username, password, and activation flags', async () => {
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);

    const input = {
      user_id: existingUser._user_id,
      username: 'new_username',
      password: 'new_password',
      is_active: false,
    };

    const result = await useCase.execute(input as any);

    expect(existingUser.username).toBe('new_username');
    expect(existingUser.password).toBe('new_password');
    expect(existingUser.is_active).toBe(false);
    expect(userRepository.update).toHaveBeenCalledWith(existingUser);
    expect(result).toEqual(UserOutputMapper.toOutput(existingUser));
  });

  it('should activate user when is_active is true', async () => {
    existingUser.deactivate(); // ensure it starts deactivated
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);

    const input = {
      user_id: existingUser.entity_id.id,
      is_active: true,
    };

    const result = await useCase.execute(input as any);

    expect(existingUser.is_active).toBe(true);
    expect(userRepository.update).toHaveBeenCalledWith(existingUser);
    expect(result).toEqual(UserOutputMapper.toOutput(existingUser));
  });

  it('should throw EntityValidationError if validation fails', async () => {
    // force the entity to have validation errors
    existingUser.changeUsername('');
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);

    const input = { user_id: existingUser._user_id };

    await expect(useCase.execute(input as any)).rejects.toThrow(
      EntityValidationError,
    );
  });

  it('should update without changing email if email not provided', async () => {
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);

    const input = { user_id: existingUser._user_id, username: 'updated_only' };
    const result = await useCase.execute(input as any);

    expect(existingUser.username).toBe('updated_only');
    expect(existingUser.email).toBe('old@example.com');
    expect(userRepository.update).toHaveBeenCalledWith(existingUser);
    expect(result).toEqual(UserOutputMapper.toOutput(existingUser));
  });
});
