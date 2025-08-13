import {
  PersonSearchParams,
  type IPersonRepository,
  type PersonSearchResult,
} from '../../../domain/person/person.repository';
import {
  PaginationOutputMapper,
  type PaginationOutput,
} from '../../_shared/pagination-output';
import type { IUseCase } from '../../_shared/use-case';
import { PersonOutputMapper, type PersonOutput } from './dto/person-output';
import type { SearchPersonsInput } from './dto/search-person.input';

export class SearchPersonsUseCase
  implements IUseCase<SearchPersonsInput, SearchPersonsOutput>
{
  constructor(private readonly personRepository: IPersonRepository) {}

  async execute(input: SearchPersonsInput): Promise<SearchPersonsOutput> {
    const params = new PersonSearchParams(input);
    const searchResult = await this.personRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: PersonSearchResult): SearchPersonsOutput {
    const items = searchResult.items.map((i) => PersonOutputMapper.toOutput(i));
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type SearchPersonsOutput = PaginationOutput<PersonOutput>;
