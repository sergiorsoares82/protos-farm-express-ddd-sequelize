import { UserEntity } from '../../../domain/user/user.entity';
import type { IUserRepository } from '../../../domain/user/user.repository';
import type { CreateUserDTO } from '../../../interface/dtos/create-user.dto';

export class UserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async createUser(input: CreateUserDTO) {
    const user = UserEntity.create(input);

    // Implement notification logic here if needed
    await this.userRepository.insert(user);

    // Implement output transformation if needed
    return {
      message: 'User created successfully',
      user: user.toJSON(),
    };
  }
}
