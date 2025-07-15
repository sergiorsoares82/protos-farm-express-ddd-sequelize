import express from 'express';
import { UserUseCase } from '../../../application/users/use-cases/user.use-case';
import { UserController } from '../controllers/user.controller';

const userUseCase = new UserUseCase();
const controller = new UserController(userUseCase);

const userRouter = express.Router();

userRouter.post('/', controller.create);

export default userRouter;
