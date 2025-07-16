import type { IUserRepository } from '../../../domain/user/user.repository';

export class UserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async createUser() {
    return {
      message: 'User created successfully',
    };
  }
}
