import express from 'express';
import { LoginInputSchema } from '../../../application/use-cases/auth/dto/login-input';
import { container } from '../../../infrastructure/container';
import { AuthController } from '../../controllers/auth.controller';
import { validateDto } from '../middlewares/validation.middleware';

const authController: AuthController = new AuthController(
  container.loginUseCase,
  container.refreshTokenUseCase,
  container.logoutUseCase,
);

const authRouter = express.Router();

authRouter.post('/login', validateDto(LoginInputSchema), authController.login);

export default authRouter;
