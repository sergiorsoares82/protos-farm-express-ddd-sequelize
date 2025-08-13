// tests/unit/interfaces/controllers/users.controller.spec.ts

import type { UserOutput } from '../../../src/application/use-cases/users/dto/user-output';
import { UsersController } from '../../../src/interfaces/controllers/users.controller';
import { SearchUsersDTOSchema } from '../../../src/interfaces/dtos/user/search-users.dto';
import {
  UsersCollectionPresenter,
  UsersPresenter,
} from '../../../src/interfaces/presenters/users.presenter';

describe('UsersController', () => {
  let controller: UsersController;
  let createUserUseCase: any;
  let updateUserUseCase: any;
  let deleteUserUseCase: any;
  let listUsersUseCase: any;
  let searchUsersUseCase: any;
  let mockRes: any;

  beforeEach(() => {
    createUserUseCase = { execute: jest.fn() };
    updateUserUseCase = { execute: jest.fn() };
    deleteUserUseCase = { execute: jest.fn() };
    listUsersUseCase = { execute: jest.fn() };
    searchUsersUseCase = { execute: jest.fn() };

    controller = new UsersController(
      createUserUseCase,
      updateUserUseCase,
      deleteUserUseCase,
      listUsersUseCase,
      searchUsersUseCase,
    );

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('create', () => {
    it('should create a user and return 201', async () => {
      const mockUser = { user_id: '1', username: 'test' };
      createUserUseCase.execute.mockResolvedValue(mockUser);

      const req = { body: { username: 'test' } } as any;
      await controller.create(req, mockRes);

      expect(createUserUseCase.execute).toHaveBeenCalledWith({
        username: 'test',
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(UsersPresenter));
    });
  });

  describe('update', () => {
    it('should update a user and return 200', async () => {
      const mockUser = { user_id: '1', username: 'updated' };
      updateUserUseCase.execute.mockResolvedValue(mockUser);

      const req = { params: { id: '1' }, body: { username: 'updated' } } as any;
      await controller.update(req, mockRes);

      expect(updateUserUseCase.execute).toHaveBeenCalledWith({
        user_id: '1',
        username: 'updated',
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(UsersPresenter));
    });
  });

  describe('delete', () => {
    it('should delete a user and return 204', async () => {
      deleteUserUseCase.execute.mockResolvedValue(undefined);

      const req = { params: { id: '1' } } as any;
      await controller.delete(req, mockRes);

      expect(deleteUserUseCase.execute).toHaveBeenCalledWith({ user_id: '1' });
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users with 200', async () => {
      const mockUsers = [
        { user_id: '1', username: 'user1' },
        { user_id: '2', username: 'user2' },
      ];
      listUsersUseCase.execute.mockResolvedValue(mockUsers);

      const req = {} as any;
      await controller.findAll(req, mockRes);

      expect(listUsersUseCase.execute).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(UsersPresenter)]),
      );
    });
  });

  describe('search', () => {
    it('should return 400 if validation fails', async () => {
      const req = { query: { invalid: 'data' } } as any;
      // Force schema to fail
      jest.spyOn(SearchUsersDTOSchema, 'safeParse').mockReturnValue({
        success: false,
        error: { errors: [{ message: 'Invalid query' }] },
      } as any);

      await controller.search(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [{ message: 'Invalid query' }],
      });
    });

    it('should execute search and return 200 with collection', async () => {
      const validQuery = { name: 'test' };
      const mockOutput = { items: [], total: 0 };
      jest.spyOn(SearchUsersDTOSchema, 'safeParse').mockReturnValue({
        success: true,
        data: validQuery,
      } as any);
      searchUsersUseCase.execute.mockResolvedValue(mockOutput);

      const req = { query: validQuery } as any;
      await controller.search(req, mockRes);

      expect(searchUsersUseCase.execute).toHaveBeenCalledWith(validQuery);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.any(UsersCollectionPresenter),
      );
    });
  });

  describe('serializeUser', () => {
    it('should wrap user in UsersPresenter', () => {
      const user: UserOutput = {
        user_id: '1',
        username: 'test',
        email: 'test@example.com',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const result = UsersController.serializeUser(user);
      expect(result).toBeInstanceOf(UsersPresenter);
    });
  });
});
