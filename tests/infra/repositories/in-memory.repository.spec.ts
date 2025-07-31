import { Entity } from '../../../src/domain/_shared/entity';
import { NotFoundError } from '../../../src/domain/_shared/errors/entity-not-found.error';
import { SearchParams } from '../../../src/domain/_shared/repository/search-params';
import { SearchResult } from '../../../src/domain/_shared/repository/search-results';
import { ValueObject } from '../../../src/domain/_shared/value-object';
import {
  InMemoryRepository,
  InMemorySearchableRepository,
} from '../../../src/infrastructure/repositories/in-memory.repository';

// Fake ValueObject
class FakeId extends ValueObject {
  constructor(public readonly id: string) {
    super();
  }
  toString() {
    return this.id;
  }
}

// Fake Entity
class FakeEntity extends Entity {
  constructor(
    public readonly entity_id: FakeId,
    public name: string,
    public created_at: Date,
  ) {
    super();
  }
  toJSON() {
    return { id: this.entity_id.toString(), name: this.name };
  }
}

// Fake Repository
class FakeRepository extends InMemoryRepository<FakeEntity, FakeId> {
  getEntity() {
    return FakeEntity;
  }
}

// Fake Searchable Repository
class FakeSearchableRepository extends InMemorySearchableRepository<
  FakeEntity,
  FakeId,
  string
> {
  sortableFields = ['name', 'created_at'];
  async applyFilter(items: FakeEntity[], filter: string | null) {
    if (!filter) return items;
    return items.filter((i) =>
      i.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
  getEntity() {
    return FakeEntity;
  }
}

describe('InMemoryRepository', () => {
  let repo: FakeRepository;
  let entity: FakeEntity;

  beforeEach(() => {
    repo = new FakeRepository();
    entity = new FakeEntity(new FakeId('1'), 'Test', new Date());
  });

  describe('CRUD operations', () => {
    it('should insert and retrieve an entity', async () => {
      await repo.insert(entity);
      expect(repo.items).toHaveLength(1);
      expect(await repo.findById(entity.entity_id)).toBe(entity);
    });

    it('should bulk insert entities', async () => {
      const entities = [
        new FakeEntity(new FakeId('2'), 'Test2', new Date()),
        new FakeEntity(new FakeId('3'), 'Test3', new Date()),
      ];
      await repo.bulkInsert(entities);
      expect(repo.items).toHaveLength(2);
    });

    it('should update an existing entity', async () => {
      await repo.insert(entity);
      const updated = new FakeEntity(
        entity.entity_id,
        'Updated',
        entity.created_at,
      );
      await repo.update(updated);
      expect(repo.items[0].name).toBe('Updated');
    });

    it('should delete an existing entity', async () => {
      await repo.insert(entity);
      await repo.delete(entity.entity_id);
      expect(repo.items).toHaveLength(0);
    });

    it('should return all entities', async () => {
      await repo.insert(entity);
      const all = await repo.findAll();
      expect(all).toEqual([entity]);
    });
  });

  describe('Error handling', () => {
    it('should throw NotFoundError when updating a non-existent entity', async () => {
      const nonExistent = new FakeEntity(
        new FakeId('99'),
        'Missing',
        new Date(),
      );
      await expect(repo.update(nonExistent)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when deleting a non-existent entity', async () => {
      await expect(repo.delete(new FakeId('99'))).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should return null when finding a non-existent entity', async () => {
      const found = await repo.findById(new FakeId('99'));
      expect(found).toBeNull();
    });
  });
});

describe('InMemorySearchableRepository', () => {
  let repo: FakeSearchableRepository;
  let entities: FakeEntity[];

  beforeEach(() => {
    repo = new FakeSearchableRepository();
    entities = [
      new FakeEntity(new FakeId('1'), 'Alice', new Date('2023-01-01')),
      new FakeEntity(new FakeId('2'), 'Bob', new Date('2023-02-01')),
      new FakeEntity(new FakeId('3'), 'Charlie', new Date('2023-03-01')),
    ];
    repo.items = entities;
  });

  describe('Filtering', () => {
    it('should filter entities by name (case-insensitive)', async () => {
      const result = await (repo as any).applyFilter(repo.items, 'bo');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Bob');
    });

    it('should return all entities if filter is null', async () => {
      const result = await (repo as any).applyFilter(repo.items, null);
      expect(result).toHaveLength(3);
    });
  });

  describe('Sorting', () => {
    it('should sort entities ascending by name', () => {
      const result = (repo as any).applySort(repo.items, 'name', 'asc');
      expect(result.map((e: FakeEntity) => e.name)).toEqual([
        'Alice',
        'Bob',
        'Charlie',
      ]);
    });

    it('should sort entities descending by name', () => {
      const result = (repo as any).applySort(repo.items, 'name', 'desc');
      expect(result.map((e: FakeEntity) => e.name)).toEqual([
        'Charlie',
        'Bob',
        'Alice',
      ]);
    });

    it('should return unsorted if sort field is invalid', () => {
      const result = (repo as any).applySort(repo.items, 'invalid', 'asc');
      expect(result).toEqual(repo.items);
    });

    it('should use a custom getter when provided', () => {
      const customGetter = jest.fn(
        (sort: string, item: FakeEntity) => item.name.length,
      );
      (repo as any).applySort(repo.items, 'name', 'asc', customGetter);
      expect(customGetter).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should paginate results correctly', () => {
      const result = (repo as any).applyPaginate(repo.items, 2, 1);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Bob');
    });

    it('should return empty array if page exceeds available data', () => {
      const result = (repo as any).applyPaginate(repo.items, 10, 5);
      expect(result).toEqual([]);
    });
  });

  describe('Search', () => {
    it('should search with filter, sort, and pagination', async () => {
      const params = new SearchParams({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'a',
      });
      const result = await repo.search(params);
      expect(result).toBeInstanceOf(SearchResult);
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.total).toBe(2);
    });
  });
});
