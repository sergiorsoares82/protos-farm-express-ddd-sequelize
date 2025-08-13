import type { IUnitOfWork } from '../../../domain/_shared/repository/unit-of-work.interface';
import { EntityValidationError } from '../../../domain/_shared/validators/validation.error';
import type { PersonUniquenessService } from '../../../domain/person/person-uniqueness.service';
import { PersonEntity } from '../../../domain/person/person.entity';
import type { IPersonRepository } from '../../../domain/person/person.repository';
import type { IUseCase } from '../../_shared/use-case';
import type { CreateUserUseCase } from '../users/create-user.use-case';
import type { CreatePersonInput } from './dto/create-person-input';
import { PersonOutputMapper, type PersonOutput } from './dto/person-output';

export class CreatePersonUseCase
  implements IUseCase<CreatePersonInput, CreatePersonOutput>
{
  constructor(
    private readonly personRepository: IPersonRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly personUniquenessService: PersonUniquenessService,
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(input: CreatePersonInput): Promise<CreatePersonOutput> {
    const normalizedInput = {
      ...input,
      company_name: input.company_name ?? undefined,
    };
    const person = PersonEntity.create(normalizedInput);

    // Check uniqueness
    await this.personUniquenessService.checkUnique(
      person.notification,
      input.name,
      input.document_number,
    );

    // Step 4: If any errors, throw once
    if (person.notification.hasErrors()) {
      throw new EntityValidationError(person.notification.toJSON());
    }

    return this.uow.do(async (unitOfWork) => {
      const transaction = unitOfWork.getTransaction();
      await this.personRepository.insert(person, transaction);
      if (input.user) {
        const userInputWithPersonId = {
          ...input.user,
          person_id: person.person_id.id, // attach the FK here
        };
        await this.createUserUseCase.execute(userInputWithPersonId, unitOfWork);
      }
      return PersonOutputMapper.toOutput(person);
    });
  }
}

type CreatePersonOutput = PersonOutput;
