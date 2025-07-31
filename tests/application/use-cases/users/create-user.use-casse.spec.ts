import { CreateUserUseCase } from '../../../../src/application/use-cases/users/create-user.use-case';
import { EmailAlreadyInUseError } from '../../../../src/domain/_shared/errors/email-already-in-use.error';
import { EntityValidationError } from '../../../../src/domain/_shared/validators/validation.error';
import { UserEntity } from '../../../../src/domain/user/user.entity';
import { UserOutputMapper } from '../../../../src/application/use-cases/users/dto/user-output';
import type { IUserRepository } from '../../../../src/domain/user/user.repository';

describe('CreateUserUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<{
    hash: jest.Mock;
    compare: jest.Mock;
  }>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      insert: jest.fn(),
    } as any;
    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as any;
    useCase = new CreateUserUseCase(userRepository, passwordHasher);
  });

  it('should throw EmailAlreadyInUseError when email is already taken', async () => {
    const input = {
      username: 'John',
      email: 'john@test.com',
      password: '123456',
      is_active: true,
    };

    userRepository.findByEmail.mockResolvedValue(
      new UserEntity({ ...input, user_id: undefined! }),
    );

    await expect(useCase.execute(input)).rejects.toThrow(
      new EmailAlreadyInUseError(input.email),
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.insert).not.toHaveBeenCalled();
  });

  it('should throw EntityValidationError when entity has validation errors', async () => {
    const input = {
      username: 'J', // invalid username (assuming min length 3)
      email: 'invalid-email',
      password: '12',
      is_active: true,
    };

    userRepository.findByEmail.mockResolvedValue(null);

    // Spy on UserEntity.create to simulate validation errors
    const fakeUser = {
      notification: {
        hasErrors: () => true,
        toJSON: () => ({ username: ['too short'] }),
      },
    } as any;
    const createSpy = jest
      .spyOn(UserEntity, 'create')
      .mockReturnValue(fakeUser);

    await expect(useCase.execute(input)).rejects.toThrow(EntityValidationError);
    expect(createSpy).toHaveBeenCalledWith(input);
    expect(userRepository.insert).not.toHaveBeenCalled();
  });

  it('should create a user and return mapped output', async () => {
    const input = {
      username: 'John',
      email: 'john@test.com',
      password: '123456',
      is_active: true,
    };

    userRepository.findByEmail.mockResolvedValue(null);

    const fakeUser = new UserEntity({
      ...input,
      user_id: undefined!,
      created_at: new Date(),
      updated_at: new Date(),
    });
    jest.spyOn(UserEntity, 'create').mockReturnValue(fakeUser);

    const mappedOutput = UserOutputMapper.toOutput(fakeUser);
    const mapperSpy = jest
      .spyOn(UserOutputMapper, 'toOutput')
      .mockReturnValue(mappedOutput);

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.insert).toHaveBeenCalledWith(fakeUser);
    expect(mapperSpy).toHaveBeenCalledWith(fakeUser);
    expect(result).toEqual(mappedOutput);
  });
});
