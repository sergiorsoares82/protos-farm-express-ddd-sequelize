// infrastructure/container.ts
import { UserSequelizeRepository } from './repositories/sequelize/repositories/user-sequelize.repository';
import { UserModel } from './repositories/sequelize/models/user.model';
import { BcryptPasswordHasher } from '../application/services/bcrypt-password-hasher.service';
import { JwtTokenService } from '../application/services/jwt-token.service';
import { CreateUserUseCase } from '../application/use-cases/users/create-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/users/delete-user.use-case';
import { SearchUsersUseCase } from '../application/use-cases/users/search-users.use-case';
import { ListUsersUseCase } from '../application/use-cases/users/list-users.use-case';
import { LoginUseCase } from '../application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/auth/refresh-token.use-case';
import { RefreshTokenSequelizeRepository } from './repositories/sequelize/repositories/refresh-token-sequelize.repository';
import { LogoutUseCase } from '../application/use-cases/auth/logout.use-case';

// Shared services
const userRepository = new UserSequelizeRepository(UserModel);
const refreshTokenRepository = new RefreshTokenSequelizeRepository();
const passwordHasher = new BcryptPasswordHasher();
const accessTokenService = new JwtTokenService(
  process.env.JWT_SECRET || 'default_secret',
);

// Use cases
const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const searchUsersUseCase = new SearchUsersUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordHasher,
  accessTokenService,
  refreshTokenRepository,
);
const refreshTokenUseCase = new RefreshTokenUseCase(
  accessTokenService,
  refreshTokenRepository,
);
const logoutUseCase = new LogoutUseCase(refreshTokenRepository);

export const container = {
  userRepository,
  passwordHasher,
  accessTokenService,
  createUserUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  searchUsersUseCase,
  listUsersUseCase,
  loginUseCase,
  refreshTokenUseCase,
  logoutUseCase,
};
