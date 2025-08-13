import { EntityNotFoundError } from '../../../domain/_shared/errors/entity-not-found.error';
import type { IUnitOfWork } from '../../../domain/_shared/repository/unit-of-work.interface';
import { EntityValidationError } from '../../../domain/_shared/validators/validation.error';
import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import type { PersonUniquenessService } from '../../../domain/person/person-uniqueness.service';
import { PersonEntity } from '../../../domain/person/person.entity';
import type { IPersonRepository } from '../../../domain/person/person.repository';
import type { IUseCase } from '../../_shared/use-case';
import { PersonOutputMapper, type PersonOutput } from './dto/person-output';
import type { UpdatePersonInput } from './dto/update-person.input';

export class UpdatePersonUseCase
  implements IUseCase<UpdatePersonInput, UpdatePersonOutput>
{
  constructor(
    private readonly personRepository: IPersonRepository,
    private readonly personUniquenessService: PersonUniquenessService,
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(input: UpdatePersonInput): Promise<UpdatePersonOutput> {
    const uuid = new Uuid(input.person_id.toString());
    const person = await this.personRepository.findById(uuid);

    if (!person) {
      throw new EntityNotFoundError(uuid, PersonEntity);
    }

    // Only check for duplicate email if it actually changed
    if (input.name && input.name !== person._name) {
      const nameExists = await this.personUniquenessService.checkUniqueName(
        person.notification,
        input.name,
      );
      console.log('nameExists', nameExists);
      if (!nameExists) {
        person.changeName(input.name);
      }
    }

    if (
      input.document_number &&
      input.document_number !== person._document_number
    ) {
      const documentNumberExists =
        await this.personUniquenessService.checkUniqueDocumentNumber(
          person.notification,
          input.document_number,
        );
      console.log('documentNumberExists', documentNumberExists);
      if (!documentNumberExists) {
        person.changeDocumentNumber(input.document_number);
      }
    }

    if (input.company_name && input.company_name !== person._company_name) {
      person.changeCompanyName(input.company_name);
    }

    // if (input.person_type && input.person_type !== person._person_type) {
    //   person.changePersonType(input.person_type);
    // }

    // if (typeof input.is_active === 'boolean') {
    //   if (input.is_active && !person.is_active) {
    //     // Only activate if currently inactive
    //     person.activate();
    //   } else if (!input.is_active && person.is_active) {
    //     // Only deactivate if currently active
    //     person.deactivate();
    //   }
    // }

    if (person.notification.hasErrors()) {
      throw new EntityValidationError(person.notification.toJSON());
    }

    this.uow.do(async (unitOfWork) => {
      await this.personRepository.update(person, unitOfWork.getTransaction());
    });

    return PersonOutputMapper.toOutput(person);
  }
}

export type UpdatePersonOutput = PersonOutput;
