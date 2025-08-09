import { EmailAlreadyInUseError } from '../../../domain/_shared/errors/email-already-in-use.error';
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

    // Only check for duplicate email if it actually changed
    if (input.email && input.email !== user._email) {
      const duplicateEmailCheck = await this.userRepository.findByEmail(
        input.email,
      );

      if (
        duplicateEmailCheck &&
        duplicateEmailCheck._user_id.id !== user._user_id.id
      ) {
        throw new EmailAlreadyInUseError(input.email);
      }

      user.changeEmail(input.email);
    }

    if (input.username && input.username !== user._username) {
      user.changeUsername(input.username);
    }

    if (input.password) {
      user.changePassword(input.password);
    }

    if (typeof input.is_active === 'boolean') {
      if (input.is_active && !user.is_active) {
        // Only activate if currently inactive
        user.activate();
      } else if (!input.is_active && user.is_active) {
        // Only deactivate if currently active
        user.deactivate();
      }
    }

    if (input.role_id !== undefined) {
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
