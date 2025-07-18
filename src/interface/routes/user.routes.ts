import express from 'express';
import { UserUseCase } from '../../application/users/use-cases/user.use-case';
import type { IUserRepository } from '../../domain/user/user.repository';
import { UserInMemoryRepository } from '../../infra/repositories/in-memory/user-in-memory.repository';
import { UserController } from '../controllers/user.controller';
import { createUserDTOSchema } from '../dtos/create-user.dto';
import { validateDto } from '../middlewares/validation.middleware';

const userRepository: IUserRepository = new UserInMemoryRepository();
const userUseCase: UserUseCase = new UserUseCase(userRepository);
const controller: UserController = new UserController(userUseCase);

const userRouter = express.Router();

userRouter.post('/', validateDto(createUserDTOSchema), controller.create);

export default userRouter;
