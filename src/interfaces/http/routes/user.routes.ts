import express from 'express';
import { container } from '../../../infrastructure/container';
import { UsersController } from '../../controllers/users.controller';
import { CreateUserDTOSchema } from '../../dtos/user/create-user.dto';
import { validateUUID } from '../middlewares/validate-uuid.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { requirePermission } from '../middlewares/require-permission.middleware';

const controller: UsersController = new UsersController(
  container.createUserUseCase,
  container.updateUserUseCase,
  container.deleteUserUseCase,
  container.listUsersUseCase,
  container.searchUsersUseCase,
  container.uow,
);

const userRouter = express.Router();
userRouter.post('/', validateDto(CreateUserDTOSchema), controller.create);
userRouter.get('/', requirePermission('view_users'), controller.search);
userRouter.patch('/:id', validateUUID('id'), controller.update);
userRouter.delete('/:id', validateUUID('id'), controller.delete);

export default userRouter;
