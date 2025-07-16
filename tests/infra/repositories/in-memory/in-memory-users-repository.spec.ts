import { UserUseCase } from '../../../../src/application/users/use-cases/user.use-case';
import { UserEntity } from '../../../../src/domain/user/user.entity';
import { InMemoryUsersRepository } from '../../../../src/infra/repositories/in-memory/in-memory-users.repository';

describe('In-Memory Users Repository Unit Test', () => {
  let usersRepository: InMemoryUsersRepository;
  let userUseCase: UserUseCase;

  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    userUseCase = new UserUseCase(usersRepository);
  });

  it('should create a user successfully', async () => {
    const user = UserEntity.create({
      username: 'Alice',
      email: 'alice@gmail.com',
      password: 'password',
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
