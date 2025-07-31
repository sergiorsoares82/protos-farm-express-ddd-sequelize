import { EmailAlreadyInUseError } from '../_shared/errors/email-already-in-use.error';
import type { IUserRepository } from '../user/user.repository';

export class ValidateUniqueEmailService {
  constructor(private readonly userRepository: IUserRepository) {}

  async validate(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new EmailAlreadyInUseError(email);
    }
  }
}
