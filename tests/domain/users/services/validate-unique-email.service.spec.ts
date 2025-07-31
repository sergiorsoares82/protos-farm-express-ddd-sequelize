import { EmailAlreadyInUseError } from '../../../../src/domain/_shared/errors/email-already-in-use.error';
import { ValidateUniqueEmailService } from '../../../../src/domain/services/validate-unique-email.service';
import { UserFakeBuilder } from '../../../../src/domain/user/user-fake-builder';
import type { IUserRepository } from '../../../../src/domain/user/user.repository';

describe('ValidateUniqueEmailService', () => {
  let service: ValidateUniqueEmailService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    service = new ValidateUniqueEmailService(userRepository);
  });

  it('should not throw if email is not in use', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(service.validate('test@example.com')).resolves.toBeUndefined();
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw EmailAlreadyInUseError if email is already in use', async () => {
    const fakeUser = UserFakeBuilder.aUser()
      .withEmail('test@example.com')
      .build();
    userRepository.findByEmail.mockResolvedValue(fakeUser);

    await expect(service.validate('test@example.com')).rejects.toThrow(
      EmailAlreadyInUseError,
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});
