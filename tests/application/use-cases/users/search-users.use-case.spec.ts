import { SearchUsersUseCase } from '../../../../src/application/use-cases/users/search-users.use-case';
import { UserSearchParams } from '../../../../src/domain/user/user.repository';
import { PaginationOutputMapper } from '../../../../src/application/_shared/pagination-output';
import { UserOutputMapper } from '../../../../src/application/use-cases/users/dto/user-output';
import { UserEntity } from '../../../../src/domain/user/user.entity';
import type {
  IUserRepository,
  UserSearchResult,
} from '../../../../src/domain/user/user.repository';

describe('SearchUsersUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let useCase: SearchUsersUseCase;

  // Keep references to spies so we can restore them later
  let userOutputSpy: jest.SpyInstance;
  let paginationOutputSpy: jest.SpyInstance;

  beforeEach(() => {
    userRepository = {
      search: jest.fn(),
    } as any;
    useCase = new SearchUsersUseCase(userRepository);

    userOutputSpy = jest.spyOn(UserOutputMapper, 'toOutput');
    paginationOutputSpy = jest.spyOn(PaginationOutputMapper, 'toOutput');
  });

  afterEach(() => {
    // Restore original implementations after each test
    userOutputSpy.mockRestore();
    paginationOutputSpy.mockRestore();
  });

  it('should call repository.search with correct params and return mapped pagination', async () => {
    const input = { page: 2, perPage: 10, sort: 'username', filter: 'john' };
    const fakeUsers = [
      new UserEntity({
        user_id: undefined!,
        username: 'John',
        email: 'john@test.com',
        password: '123456',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }),
    ];
    const searchResult: UserSearchResult = {
      items: fakeUsers,
      total: 1,
      current_page: 2,
      per_page: 10,
      last_page: 1,
      toJSON: () => ({
        items: searchResult.items,
        total: searchResult.total,
        current_page: searchResult.current_page,
        per_page: searchResult.per_page,
        last_page: searchResult.last_page,
      }),

      equals: () => false,
    };

    userRepository.search.mockResolvedValue(searchResult);

    // Mock mapper behavior for this test
    userOutputSpy.mockImplementation(() => ({
      user_id: 'id',
      username: 'John',
      email: 'john@test.com',
      is_active: true,
      created_at: searchResult.items[0].created_at,
      updated_at: searchResult.items[0].updated_at,
    }));
    paginationOutputSpy.mockImplementation(() => ({
      items: [
        {
          user_id: 'id',
          username: 'John',
          email: 'john@test.com',
          is_active: true,
          created_at: searchResult.items[0].created_at,
          updated_at: searchResult.items[0].updated_at,
        },
      ],
      total: searchResult.total,
      current_page: searchResult.current_page,
      per_page: searchResult.per_page,
      last_page: searchResult.last_page,
    }));

    const result = await useCase.execute(input);

    expect(userRepository.search).toHaveBeenCalledWith(
      expect.any(UserSearchParams),
    );
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('should return an empty result when no users are found', async () => {
    const input = { page: 1, perPage: 10 };
    const searchResult: UserSearchResult = {
      items: [],
      total: 0,
      current_page: 1,
      per_page: 10,
      last_page: 1,
      toJSON: () => ({
        items: searchResult.items,
        total: searchResult.total,
        current_page: searchResult.current_page,
        per_page: searchResult.per_page,
        last_page: searchResult.last_page,
      }),

      equals: () => false,
    };

    userRepository.search.mockResolvedValue(searchResult);

    // In this test, mock mapper to return empty results correctly
    userOutputSpy.mockImplementation(() => {
      throw new Error(
        'UserOutputMapper.toOutput should not be called with empty items',
      );
    });
    paginationOutputSpy.mockImplementation(() => ({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 10,
      last_page: 1,
    }));

    const result = await useCase.execute(input);

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(userRepository.search).toHaveBeenCalledWith(
      expect.any(UserSearchParams),
    );
  });
});
