import type { Request, Response } from 'express';
import type { UserUseCase } from '../../../application/users/use-cases/user.use-case';

export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}
  create = async (req: Request, res: Response) => {
    const user = await this.userUseCase.createUser();
    return res.status(201).json(user);
  };
}
