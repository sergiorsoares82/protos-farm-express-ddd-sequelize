import { PaginationOutputMapper } from '../../../src/application/_shared/pagination-output';
import type { SearchResult } from '../../../src/domain/_shared/repository/search-results';
import { Uuid } from '../../../src/domain/_shared/value-objects/uuid.vo';

describe('PaginationOutputMapper', () => {
  // Fake entity that matches the minimum shape of your domain Entity
  type FakeEntity = {
    entity_id: Uuid;
    notification: any;
    toJSON: () => any;
  };

  it('should map SearchResult props to PaginationOutput', () => {
    // Arrange
    const items: FakeEntity[] = [
      {
        entity_id: new Uuid(),
        notification: null,
        toJSON: () => ({ id: '1', name: 'Test' }),
      },
      {
        entity_id: new Uuid(),
        notification: null,
        toJSON: () => ({ id: '2', name: 'Other' }),
      },
    ];

    const props: Omit<SearchResult<FakeEntity>, 'items'> = {
      total: 20,
      current_page: 2,
      last_page: 4,
      per_page: 5,
      // If SearchResult has extra methods like toJSON/equal, add stubs here
      toJSON: () => ({}),
      equals: () => false,
    } as any;

    // Act
    const output = PaginationOutputMapper.toOutput(items, props);

    // Assert
    expect(output).toEqual({
      items,
      total: 20,
      current_page: 2,
      last_page: 4,
      per_page: 5,
    });
  });

  it('should work with empty items', () => {
    const props: Omit<SearchResult<FakeEntity>, 'items'> = {
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: 10,
      toJSON: () => ({}),
      equals: () => false,
    } as any;

    const output = PaginationOutputMapper.toOutput([], props);

    expect(output).toEqual({
      items: [],
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: 10,
    });
  });

  it('should preserve item types', () => {
    const uuid = new Uuid();
    const items: FakeEntity[] = [
      {
        entity_id: uuid,
        notification: null,
        toJSON: () => ({ id: uuid, value: 10 }),
      },
    ];
    const props: Omit<SearchResult<FakeEntity>, 'items'> = {
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 10,
      toJSON: () => ({}),
      equals: () => false,
    } as any;

    const output = PaginationOutputMapper.toOutput(items, props);

    output.items.forEach((item) => {
      expect(typeof item.toJSON().value).toBe('number');
    });
  });
});
