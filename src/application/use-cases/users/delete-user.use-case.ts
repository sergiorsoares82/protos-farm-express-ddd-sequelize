import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import type { IUserRepository } from '../../../domain/user/user.repository';
import type { IUseCase } from '../../_shared/use-case';
import type { DeleteUserInput } from './dto/delete-user.input';

export class DeleteUserUseCase
  implements IUseCase<DeleteUserInput, DeleteUserOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const uuid = new Uuid(input.user_id);
    await this.userRepository.delete(uuid);
  }
}

export type DeleteUserOutput = void;
