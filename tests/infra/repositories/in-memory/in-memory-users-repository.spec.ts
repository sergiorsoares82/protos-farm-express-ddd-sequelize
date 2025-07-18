import { UserUseCase } from '../../../../src/application/users/use-cases/user.use-case';
import { UserEntity } from '../../../../src/domain/user/user.entity';
import { UserInMemoryRepository } from '../../../../src/infra/repositories/in-memory/user-in-memory.repository';

describe('In-Memory Users Repository Unit Test', () => {
  let usersRepository: UserInMemoryRepository;
  let userUseCase: UserUseCase;

  beforeAll(() => {
    usersRepository = new UserInMemoryRepository();
    userUseCase = new UserUseCase(usersRepository);
  });

  it('should create a user successfully', async () => {
    const user = UserEntity.create({
      username: 'Alice',
      email: 'alice@gmail.com',
      password: 'password',
      is_active: true,
    });

    await usersRepository.insert(user);
    const createdUser = await usersRepository.findById(user.user_id);

    console.log(usersRepository.items);

    expect(createdUser).toBeDefined();
    expect(createdUser?.username).toBe('Alice');
    expect(createdUser?.email).toBe('alice@gmail.com');
    expect(createdUser?.password).toBe('password');
  });
});
