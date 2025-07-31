// user-sequelize.repository.int.spec.ts
import { Sequelize } from 'sequelize-typescript';
import { UserSequelizeRepository } from '../../../../../src/infrastructure/repositories/sequelize/repositories/user-sequelize.repository';
import { UserModel } from '../../../../../src/infrastructure/repositories/sequelize/models/user.model';
import { UserEntity } from '../../../../../src/domain/user/user.entity';
import { Uuid } from '../../../../../src/domain/_shared/value-objects/uuid.vo';
import { UserSearchParams } from '../../../../../src/domain/user/user.repository';
import { initAllModels } from '../../../../../src/infrastructure/database/init-models';

describe('UserSequelizeRepository (Integration)', () => {
  let sequelize: Sequelize;
  let repository: UserSequelizeRepository;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });
    initAllModels(sequelize);
    await sequelize.sync({ force: true });

    repository = new UserSequelizeRepository(UserModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should insert and find by id', async () => {
    const entity = new UserEntity({
      user_id: new Uuid(),
      username: 'john_doe',
      email: 'john@example.com',
      password: 'secret',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await repository.insert(entity);

    const found = await repository.findById(entity.entity_id);
    expect(found?.username).toBe('john_doe');
  });

  it('should update a user', async () => {
    const entity = new UserEntity({
      user_id: new Uuid(),
      username: 'jane_doe',
      email: 'jane@example.com',
      password: 'secret',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await repository.insert(entity);

    entity.changeUsername('updated_name');
    await repository.update(entity);

    const updated = await repository.findById(entity.entity_id);
    expect(updated?.username).toBe('updated_name');
  });

  it('should delete a user', async () => {
    const entity = new UserEntity({
      user_id: new Uuid(),
      username: 'delete_me',
      email: 'delete@example.com',
      password: 'secret',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await repository.insert(entity);

    await repository.delete(entity.entity_id);
    const deleted = await repository.findById(entity.entity_id);
    expect(deleted).toBeNull();
  });

  it('should search with pagination and sorting', async () => {
    await UserModel.destroy({ where: {} });
    for (let i = 1; i <= 5; i++) {
      await repository.insert(
        new UserEntity({
          user_id: new Uuid(),
          username: `user${i}`,
          email: `user${i}@example.com`,
          password: 'secret',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      );
    }

    const params = new UserSearchParams({
      page: 1,
      per_page: 2,
      sort: 'username',
      sort_dir: 'asc',
    });
    const result = await repository.search(params);

    expect(result.items.length).toBe(2);
    expect(result.total).toBe(5);
    expect(result.items[0].username).toBe('user1');
  });
});
