import { DeleteUserUseCase } from '../../../../src/application/use-cases/users/delete-user.use-case';
import { EntityNotFoundError } from '../../../../src/domain/_shared/errors/entity-not-found.error';
import { Uuid } from '../../../../src/domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../../src/domain/user/user.entity';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let userRepository: { delete: jest.Mock };

  beforeEach(() => {
    userRepository = {
      delete: jest.fn(),
    };
    useCase = new DeleteUserUseCase(userRepository as any);
  });

  it('should call repository.delete with correct Uuid', async () => {
    const input = { user_id: 'a3f5b0a1-b6d9-4f90-a8d0-4abcfb93d12a' };
    await useCase.execute(input);

    expect(userRepository.delete).toHaveBeenCalledTimes(1);
    const uuidArg = userRepository.delete.mock.calls[0][0];
    expect(uuidArg).toBeInstanceOf(Uuid);
    expect(uuidArg.id).toBe(input.user_id);
  });

  it('should propagate NotFoundError from repository', async () => {
    const input = { user_id: 'a3f5b0a1-b6d9-4f90-a8d0-4abcfb93d12a' };
    userRepository.delete.mockRejectedValue(
      new EntityNotFoundError(new Uuid(input.user_id), UserEntity),
    );

    await expect(useCase.execute(input)).rejects.toThrow(EntityNotFoundError);
  });

  it('should resolve with void when deletion succeeds', async () => {
    userRepository.delete.mockResolvedValue(undefined);
    const input = { user_id: 'a3f5b0a1-b6d9-4f90-a8d0-4abcfb93d12a' };

    const result = await useCase.execute(input);
    expect(result).toBeUndefined();
  });
});
