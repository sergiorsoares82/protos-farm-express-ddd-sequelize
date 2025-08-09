import type { Request, Response } from 'express';
import type { UserOutput } from '../../application/use-cases/users/dto/user-output';
import type { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import type { ListUsersUseCase } from '../../application/use-cases/users/list-users.use-case';
import type { SearchUsersUseCase } from '../../application/use-cases/users/search-users.use-case';
import { SearchUsersDTOSchema } from '../dtos/search-users.dto';
import {
  UsersCollectionPresenter,
  UsersPresenter,
} from '../presenters/users.presenter';
import type { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';
import type { UpdateUserDTO } from '../dtos/update-user.dto';
import type { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';

export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly searchUsersUseCase: SearchUsersUseCase,
  ) {}
  create = async (req: Request, res: Response) => {
    const user = await this.createUserUseCase.execute(req.body);
    return res.status(201).json(UsersController.serializeUser(user));
  };

  update = async (req: Request, res: Response) => {
    console.log('entrou no patch');
    const userId = req.params.id;
    const updateUserDto: UpdateUserDTO = req.body;
    const user = await this.updateUserUseCase.execute({
      ...updateUserDto,
      user_id: userId,
    });
    return res.status(200).json(UsersController.serializeUser(user));
  };

  delete = async (req: Request, res: Response) => {
    const userId = req.params.id;
    await this.deleteUserUseCase.execute({ user_id: userId });
    return res.status(204).send();
  };

  findAll = async (req: Request, res: Response) => {
    const users = await this.listUsersUseCase.execute();
    return res.status(200).json(users.map(UsersController.serializeUser));
  };

  search = async (req: Request, res: Response) => {
    const result = SearchUsersDTOSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    const output = await this.searchUsersUseCase.execute(result.data);
    return res.status(200).json(new UsersCollectionPresenter(output));
  };

  static serializeUser(user: UserOutput) {
    return new UsersPresenter(user);
  }
}
