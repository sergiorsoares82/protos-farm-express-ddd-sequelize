import type { IUnitOfWork } from '../../../domain/_shared/repository/unit-of-work.interface';
import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import type { IUserRepository } from '../../../domain/user/user.repository';
import type { IUseCase } from '../../_shared/use-case';
import type { DeleteUserInput } from './dto/delete-user.input';

export class DeleteUserUseCase
  implements IUseCase<DeleteUserInput, DeleteUserOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    input: DeleteUserInput,
    uow: IUnitOfWork,
  ): Promise<DeleteUserOutput> {
    const uuid = new Uuid(input.user_id);
    await this.userRepository.delete(uuid, uow);
  }
}

export type DeleteUserOutput = void;
