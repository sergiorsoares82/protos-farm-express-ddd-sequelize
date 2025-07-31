import { Uuid } from '../../../../src/domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../../src/domain/user/user.entity';
import { UserInMemoryRepository } from '../../../../src/infrastructure/repositories/in-memory/user-in-memory.repository';

function createUser(
  username: string,
  email: string,
  createdAt: Date,
): UserEntity {
  return new UserEntity({
    user_id: new Uuid(), // <-- Generate valid UUID automatically
    username,
    email,
    password: 'pass',
    is_active: true,
    created_at: createdAt,
    updated_at: createdAt,
  });
}

describe('UserInMemoryRepository', () => {
  let repo: UserInMemoryRepository;
  let user1: UserEntity;
  let user2: UserEntity;
  let user3: UserEntity;

  beforeEach(async () => {
    repo = new UserInMemoryRepository();

    user1 = createUser('Alice', 'alice@test.com', new Date('2023-01-01'));
    user2 = createUser('Bob', 'bob@test.com', new Date('2023-02-01'));
    user3 = createUser('Charlie', 'charlie@test.com', new Date('2023-03-01'));

    await repo.bulkInsert([user1, user2, user3]);
  });

  describe('applyFilter', () => {
    it('returns all items if filter is empty', async () => {
      const filtered = await (repo as any).applyFilter(repo.items, null);
      expect(filtered).toHaveLength(3);
    });

    it('filters users by username case-insensitively', async () => {
      const filtered = await (repo as any).applyFilter(repo.items, 'bo');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].username).toBe('Bob');
    });
  });

  describe('applySort', () => {
    it('sorts by given field ascending', () => {
      const sorted = (repo as any).applySort(
        repo.items,
        'username',
        'asc',
      ) as UserEntity[];
      expect(sorted.map((u) => u.username)).toEqual([
        'Alice',
        'Bob',
        'Charlie',
      ]);
    });

    it('sorts by given field descending', () => {
      const sorted = (repo as any).applySort(repo.items, 'username', 'desc');
      expect(sorted.map((u: UserEntity) => u.username)).toEqual([
        'Charlie',
        'Bob',
        'Alice',
      ]);
    });

    it('defaults to sorting by created_at descending if no sort is provided', () => {
      const sorted = (repo as any).applySort(repo.items, null, null);
      expect(sorted.map((u: UserEntity) => u.username)).toEqual([
        'Charlie',
        'Bob',
        'Alice',
      ]);
    });

    it('returns original array if sort field is not sortable', () => {
      const sorted = (repo as any).applySort(repo.items, 'nonexistent', 'asc');
      expect(sorted).toEqual(repo.items);
    });
  });

  describe('findByEmail', () => {
    it('returns user by exact email', async () => {
      const user = await repo.findByEmail('bob@test.com');
      expect(user).toEqual(user2);
    });

    it('returns null if email not found', async () => {
      const user = await repo.findByEmail('unknown@test.com');
      expect(user).toBeNull();
    });
  });

  describe('getEntity', () => {
    it('returns UserEntity class', () => {
      expect(repo.getEntity()).toBe(UserEntity);
    });
  });
});
