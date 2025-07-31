import { NotFoundError } from '../../../domain/_shared/errors/entity-not-found.error';
import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../domain/user/user.entity';
import type { IUserRepository } from '../../../domain/user/user.repository';
import type { IUseCase } from '../../_shared/use-case';
import { UserOutputMapper, type UserOutput } from './dto/user-output';

export class GetUserUseCase implements IUseCase<GetUserInput, GetUserOutput> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const uuid = new Uuid(input.user_id);
    const user = await this.userRepository.findById(uuid);
    if (!user) {
      throw new NotFoundError(uuid, UserEntity);
    }
    return UserOutputMapper.toOutput(user);
  }
}

export type GetUserInput = {
  user_id: string;
};

export type GetUserOutput = UserOutput;
