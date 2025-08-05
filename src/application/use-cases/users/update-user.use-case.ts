import { EntityNotFoundError } from '../../../domain/_shared/errors/entity-not-found.error';
import { EntityValidationError } from '../../../domain/_shared/validators/validation.error';
import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../domain/user/user.entity';
import type { IUserRepository } from '../../../domain/user/user.repository';
import type { IUseCase } from '../../_shared/use-case';
import type { UpdateUserInput } from './dto/update-user.input';
import { UserOutputMapper, type UserOutput } from './dto/user-output';

export class UpdateUserUseCase
  implements IUseCase<UpdateUserInput, UpdateUserOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const uuid = new Uuid(input.user_id.toString());
    const user = await this.userRepository.findById(uuid);

    if (!user) {
      throw new EntityNotFoundError(uuid, UserEntity);
    }

    if (input.email) {
      const duplicateEmailCheck = await this.userRepository.findByEmail(
        input.email,
      );

      if (
        duplicateEmailCheck &&
        duplicateEmailCheck._user_id !== user._user_id
      ) {
        throw new Error(`Email ${input.email} is already in use.`);
      }
    }

    if (input.username) {
      user.changeUsername(input.username);
    }

    if (input.password) {
      user.changePassword(input.password);
    }

    if (input.is_active === true) {
      user.activate();
    }

    if (input.is_active === false) {
      user.deactivate();
    }

    if (input.role_id !== undefined) {
      console.log('input.role_id', input.role_id);
      user.changeRole(input.role_id ?? null); // Allow role_id to be null
    }

    if (user.notification.hasErrors()) {
      throw new EntityValidationError(user.notification.toJSON());
    }

    await this.userRepository.update(user);

    return UserOutputMapper.toOutput(user);
  }
}

export type UpdateUserOutput = UserOutput;
