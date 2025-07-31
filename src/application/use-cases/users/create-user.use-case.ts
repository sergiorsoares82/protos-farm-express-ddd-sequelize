import { EmailAlreadyInUseError } from '../../../domain/_shared/errors/email-already-in-use.error';
import { EntityValidationError } from '../../../domain/_shared/validators/validation.error';
import type { IPasswordHasher } from '../../../domain/services/password-hasher.interface';
import { UserEntity } from '../../../domain/user/user.entity';
import type { IUserRepository } from '../../../domain/user/user.repository';
import type { IUseCase } from '../../_shared/use-case';
import type { CreateUserInput } from './dto/create-user.input';
import { UserOutputMapper, type UserOutput } from './dto/user-output';

export class CreateUserUseCase
  implements IUseCase<CreateUserInput, CreateUserOutput>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const duplicateEmailCheck = await this.userRepository.findByEmail(
      input.email,
    );

    if (duplicateEmailCheck) {
      throw new EmailAlreadyInUseError(input.email);
    }

    // Hash the password before creating the user entity
    const hashedPassword = await this.passwordHasher.hash(input.password);
    input.password = hashedPassword;

    const user = UserEntity.create(input);

    // Implement notification logic here if needed
    if (user.notification.hasErrors()) {
      throw new EntityValidationError(user.notification.toJSON());
    }

    await this.userRepository.insert(user);

    // Implement output transformation if needed
    return UserOutputMapper.toOutput(user);
  }
}

type CreateUserOutput = UserOutput;
