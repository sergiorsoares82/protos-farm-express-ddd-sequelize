import express from 'express';
import { UserUseCase } from '../../../application/users/use-cases/user.use-case';
import { UserController } from '../controllers/user.controller';
import { validateBody } from '../../_shared/middlewares/validation.middleware';
import { createUserSchema } from './user.schema';
import { InMemoryUsersRepository } from '../../../infra/repositories/in-memory/in-memory-users.repository';
import type { IUserRepository } from '../../../domain/user/user.repository';

const userRepository: IUserRepository = new InMemoryUsersRepository();
const userUseCase: UserUseCase = new UserUseCase(userRepository);
const controller: UserController = new UserController(userUseCase);

const userRouter = express.Router();

userRouter.post('/', validateBody(createUserSchema), controller.create);

export default userRouter;
