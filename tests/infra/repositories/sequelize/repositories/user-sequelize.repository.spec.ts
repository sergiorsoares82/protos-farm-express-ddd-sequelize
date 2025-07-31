import { Op } from 'sequelize';
import { UserSequelizeRepository } from '../../../../../src/infrastructure/repositories/sequelize/repositories/user-sequelize.repository';
import { UserEntity } from '../../../../../src/domain/user/user.entity';
import { Uuid } from '../../../../../src/domain/_shared/value-objects/uuid.vo';
import { UserModelMapper } from '../../../../../src/infrastructure/repositories/sequelize/model-mapper/user-model-mapper';
import { NotFoundError } from '../../../../../src/domain/_shared/errors/entity-not-found.error';
import { UserSearchParams } from '../../../../../src/domain/user/user.repository';

describe('UserSequelizeRepository', () => {
  let repository: UserSequelizeRepository;
  let userModelMock: any;

  const mockUserEntity = new UserEntity({
    user_id: new Uuid(),
    username: 'john_doe',
    email: 'john@example.com',
    password: 'hashed_password',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const mockUserModel = {
    toJSON: jest.fn().mockReturnValue({ user_id: mockUserEntity.entity_id.id }),
  };

  beforeEach(() => {
    userModelMock = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      bulkCreate: jest.fn(),
    };
    repository = new UserSequelizeRepository(userModelMock);
    jest
      .spyOn(UserModelMapper, 'toModel')
      .mockReturnValue(mockUserModel as any);
    jest.spyOn(UserModelMapper, 'toEntity').mockReturnValue(mockUserEntity);
  });

  describe('insert', () => {
    const mockUserModel = {
      user_id: mockUserEntity.entity_id.id,
      username: mockUserEntity.username,
      email: mockUserEntity.email,
      password: mockUserEntity.password,
      is_active: mockUserEntity.is_active,
      created_at: mockUserEntity.created_at,
      updated_at: mockUserEntity.updated_at,
      toJSON: jest.fn().mockImplementation(function (
        this: typeof mockUserModel,
      ) {
        return {
          user_id: this.user_id,
          username: this.username,
          email: this.email,
          password: this.password,
          is_active: this.is_active,
          created_at: this.created_at,
          updated_at: this.updated_at,
        };
      }),
    };

    beforeEach(() => {
      userModelMock.create = jest.fn();
      jest
        .spyOn(UserModelMapper, 'toModel')
        .mockReturnValue(mockUserModel as any);
    });

    it('should insert a user', async () => {
      await repository.insert(mockUserEntity);

      // The argument passed to create()
      const createdArg = userModelMock.create.mock.calls[0][0];

      // If it has toJSON, get plain object, else use the argument as is
      const plain = createdArg.toJSON ? createdArg.toJSON() : createdArg;

      expect(plain).toEqual(
        expect.objectContaining({
          user_id: mockUserEntity.entity_id.id,
          username: mockUserEntity.username,
          email: mockUserEntity.email,
          password: mockUserEntity.password,
          is_active: mockUserEntity.is_active,
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return user entity when found', async () => {
      userModelMock.findByPk.mockResolvedValue(mockUserModel);
      const result = await repository.findById(mockUserEntity.entity_id);
      expect(result).toEqual(mockUserEntity);
    });

    it('should return null when not found', async () => {
      userModelMock.findByPk.mockResolvedValue(null);
      const result = await repository.findById(mockUserEntity.entity_id);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      userModelMock.update.mockResolvedValue([1]);
      await repository.update(mockUserEntity);
      expect(userModelMock.update).toHaveBeenCalledWith(
        mockUserModel.toJSON(),
        { where: { user_id: mockUserEntity.entity_id.id } },
      );
    });

    it('should throw NotFoundError when no rows affected', async () => {
      userModelMock.update.mockResolvedValue([0]);
      await expect(repository.update(mockUserEntity)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      userModelMock.destroy.mockResolvedValue(1);
      await repository.delete(mockUserEntity.entity_id);
      expect(userModelMock.destroy).toHaveBeenCalledWith({
        where: { user_id: mockUserEntity.entity_id.id },
      });
    });

    it('should throw NotFoundError when no rows affected', async () => {
      userModelMock.destroy.mockResolvedValue(0);
      await expect(repository.delete(mockUserEntity.entity_id)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('bulkInsert', () => {
    it('should bulk insert users', async () => {
      await repository.bulkInsert([mockUserEntity]);
      expect(userModelMock.bulkCreate).toHaveBeenCalledWith([mockUserModel]);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      userModelMock.findAll.mockResolvedValue([mockUserModel]);
      const result = await repository.findAll();
      expect(result).toEqual([mockUserEntity]);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      userModelMock.findOne.mockResolvedValue(mockUserModel);
      const result = await repository.findByEmail('john@example.com');
      expect(result).toEqual(mockUserEntity);
    });

    it('should return null when not found', async () => {
      userModelMock.findOne.mockResolvedValue(null);
      const result = await repository.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('should return paginated users with filter and sort', async () => {
      userModelMock.findAndCountAll.mockResolvedValue({
        rows: [mockUserModel],
        count: 1,
      });

      const searchParams = new UserSearchParams({
        page: 1,
        per_page: 10,
        filter: 'john',
        sort: 'name',
        sort_dir: 'asc',
      });
      const result = await repository.search(searchParams);

      expect(userModelMock.findAndCountAll).toHaveBeenCalledWith({
        where: { username: { [Op.like]: '%john%' } },
        order: [['name', 'ASC']],
        offset: 0,
        limit: 10,
      });

      expect(result.items).toEqual([mockUserEntity]);
      expect(result.total).toBe(1);
      expect(result.current_page).toBe(1);
      expect(result.per_page).toBe(10);
    });

    it('should default to created_at desc when no sort provided', async () => {
      userModelMock.findAndCountAll.mockResolvedValue({
        rows: [mockUserModel],
        count: 1,
      });

      const searchParams = new UserSearchParams({
        page: 2,
        per_page: 5,
        filter: null,
        sort: null,
        sort_dir: null,
      });

      await repository.search(searchParams);

      expect(userModelMock.findAndCountAll).toHaveBeenCalledWith({
        where: undefined,
        order: [['created_at', 'DESC']],
        offset: 5,
        limit: 5,
      });
    });
  });

  describe('getEntity', () => {
    it('should return UserEntity class', () => {
      expect(repository.getEntity()).toBe(UserEntity);
    });
  });
});
