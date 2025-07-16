import express from 'express';
import { UserUseCase } from '../../../application/users/use-cases/user.use-case';
import { UserController } from '../controllers/user.controller';
import { validateBody } from '../../_shared/middlewares/validation.middleware';
import { createUserSchema } from './user.schema';

const userUseCase = new UserUseCase();
const controller = new UserController(userUseCase);

const userRouter = express.Router();

userRouter.post('/', validateBody(createUserSchema), controller.create);

export default userRouter;
