import express from 'express';
import { UserUseCase } from '../../application/users/use-cases/user.use-case';
import { UserController } from '../controllers/user.controller';
import { InMemoryUsersRepository } from '../../infra/repositories/in-memory/in-memory-users.repository';
import type { IUserRepository } from '../../domain/user/user.repository';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateUserDTO, createUserDTOSchema } from '../dtos/create-user.dto';

const userRepository: IUserRepository = new InMemoryUsersRepository();
const userUseCase: UserUseCase = new UserUseCase(userRepository);
const controller: UserController = new UserController(userUseCase);

const userRouter = express.Router();

userRouter.post('/', validateDto(createUserDTOSchema), controller.create);

export default userRouter;
