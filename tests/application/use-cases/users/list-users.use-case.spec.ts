import { UserOutputMapper } from '../../../../src/application/use-cases/users/dto/user-output';
import { ListUsersUseCase } from '../../../../src/application/use-cases/users/list-users.use-case';
import { Uuid } from '../../../../src/domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../../src/domain/user/user.entity';
import type { IUserRepository } from '../../../../src/domain/user/user.repository';

describe('ListUsersUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let useCase: ListUsersUseCase;

  beforeEach(() => {
    userRepository = {
      findAll: jest.fn(),
    } as any;
    useCase = new ListUsersUseCase(userRepository);
  });

  it('should return mapped users', async () => {
    const uuid1 = new Uuid();
    const uuid2 = new Uuid();
    const now = new Date();

    // Arrange: create real UserEntity instances
    const fakeUsers = [
      new UserEntity({
        user_id: uuid1,
        username: 'John',
        email: 'john@test.com',
        password: '123',
        is_active: true,
        created_at: now,
        updated_at: now,
      }),
      new UserEntity({
        user_id: uuid2,
        username: 'Jane',
        email: 'jane@test.com',
        password: '456',
        is_active: false,
        created_at: now,
        updated_at: now,
      }),
    ];
    userRepository.findAll.mockResolvedValue(fakeUsers);

    // Expected output using real mapper
    const expected = fakeUsers.map((user) => UserOutputMapper.toOutput(user));

    // Act
    const result = await useCase.execute();

    // Assert
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should return an empty array when no users are found', async () => {
    userRepository.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });
});
