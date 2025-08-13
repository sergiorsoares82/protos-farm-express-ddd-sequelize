import { EntityNotFoundError } from '../../../domain/_shared/errors/entity-not-found.error';
import type { IUnitOfWork } from '../../../domain/_shared/repository/unit-of-work.interface';
import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import { PersonEntity } from '../../../domain/person/person.entity';
import type { IPersonRepository } from '../../../domain/person/person.repository';
import type { IUserRepository } from '../../../domain/user/user.repository';
import type { IUseCase } from '../../_shared/use-case';

export class DeletePersonUseCase
  implements IUseCase<DeletePersonInput, DeletePersonOutput>
{
  constructor(
    private readonly personRepository: IPersonRepository,
    private readonly userRepository: IUserRepository,
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(input: DeletePersonInput): Promise<DeletePersonOutput> {
    return this.uow.do(async (unitOfWork) => {
      const transaction = unitOfWork.getTransaction();

      const personUuid = new Uuid(input.person_id);
      // 1. Find the person
      const person = await this.personRepository.findById(
        personUuid,
        transaction,
      );
      if (!person) {
        throw new EntityNotFoundError(input.person_id, PersonEntity);
      }

      // 2. Check if there is a user linked to the person
      const user = await this.userRepository.findByPersonId(
        personUuid,
        transaction,
      );
      if (user) {
        await this.userRepository.delete(user.user_id, transaction);
      }

      // 3. Delete the person
      await this.personRepository.delete(personUuid, transaction);

      // 4. Return output
      return { deleted: true };
    });
  }
}

// DTO types
export type DeletePersonInput = {
  person_id: string;
};

export type DeletePersonOutput = {
  deleted: boolean;
};
