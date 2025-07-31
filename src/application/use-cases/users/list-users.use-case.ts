import type { IUserRepository } from '../../../domain/user/user.repository';
import type { IUseCase } from '../../_shared/use-case';
import { UserOutputMapper, type UserOutput } from './dto/user-output';

export class ListUsersUseCase implements IUseCase<null, UserOutput[]> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserOutput[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserOutputMapper.toOutput(user));
  }
}
