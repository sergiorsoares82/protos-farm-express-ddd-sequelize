import { EntityNotFoundError } from '../../../domain/_shared/errors/entity-not-found.error';
import { Uuid } from '../../../domain/_shared/value-objects/uuid.vo';
import { PersonEntity } from '../../../domain/person/person.entity';
import type { IPersonRepository } from '../../../domain/person/person.repository';
import type { IUseCase } from '../../_shared/use-case';
import { PersonOutputMapper, type PersonOutput } from './dto/person-output';

export class GetPersonUseCase
  implements IUseCase<GetPersonInput, GetPersonOutput>
{
  constructor(private readonly personRepository: IPersonRepository) {}

  async execute(input: GetPersonInput): Promise<GetPersonOutput> {
    const uuid = new Uuid(input.person_id);
    const person = await this.personRepository.findById(uuid);
    if (!person) {
      throw new EntityNotFoundError(uuid, PersonEntity);
    }
    return PersonOutputMapper.toOutput(person);
  }
}

export type GetPersonInput = {
  person_id: string;
};

export type GetPersonOutput = PersonOutput;
