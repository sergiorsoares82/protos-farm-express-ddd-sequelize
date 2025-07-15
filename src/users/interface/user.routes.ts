import express from 'express';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  const useCase = new CreateUserUseCase();
  console.log('useCase:', await useCase.execute()); // Optional debug
  res.status(201).json(useCase.execute());
});

export default userRouter;
