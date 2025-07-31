import {
  UserSearchParams,
  type IUserRepository,
  type UserSearchResult,
} from '../../../domain/user/user.repository';
import {
  PaginationOutputMapper,
  type PaginationOutput,
} from '../../_shared/pagination-output';
import type { IUseCase } from '../../_shared/use-case';
import type { SearchUsersInput } from './dto/search-user.input';
import { UserOutputMapper, type UserOutput } from './dto/user-output';

export class SearchUsersUseCase
  implements IUseCase<SearchUsersInput, SearchUsersOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: SearchUsersInput): Promise<SearchUsersOutput> {
    const params = new UserSearchParams(input);
    const searchResult = await this.userRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: UserSearchResult): SearchUsersOutput {
    const items = searchResult.items.map((i) => UserOutputMapper.toOutput(i));
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type SearchUsersOutput = PaginationOutput<UserOutput>;
