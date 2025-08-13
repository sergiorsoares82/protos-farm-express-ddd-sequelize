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
import { CreatePersonUseCase } from '../application/use-cases/persons/create-person.use-case';
import { PersonSequelizeRepository } from './repositories/sequelize/repositories/person-sequelize.repository';
import { PersonModel } from './repositories/sequelize/models/person.model';
import { PersonUniquenessService } from '../domain/person/person-uniqueness.service';
import { UnitOfWorkSequelize } from './repositories/sequelize/unit-of-work-sequelize';
import { Sequelize } from 'sequelize';
import sequelizeOptions from '../interfaces/_shared/config';
import { DeletePersonUseCase } from '../application/use-cases/persons/delete-person.use-case';
import { SearchPersonsUseCase } from '../application/use-cases/persons/search-persons.use-case';
import { GetPersonUseCase } from '../application/use-cases/persons/get-person.use-case';
import { UpdatePersonUseCase } from '../application/use-cases/persons/update-person.use-case';

// Unit of Work
const sequelize = new Sequelize(sequelizeOptions);
const uow = new UnitOfWorkSequelize(sequelize);

// Shared services
const userRepository = new UserSequelizeRepository(UserModel);
const refreshTokenRepository = new RefreshTokenSequelizeRepository();
const passwordHasher = new BcryptPasswordHasher();
const accessTokenService = new JwtTokenService(
  process.env.JWT_SECRET || 'default_secret',
);

// User use cases
const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
const updateUserUseCase = new UpdateUserUseCase(userRepository, uow);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const searchUsersUseCase = new SearchUsersUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);

// Auth use cases
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

// Person use cases
const personRepository = new PersonSequelizeRepository(PersonModel);
const personUniquenessService = new PersonUniquenessService(personRepository);
const createPersonUseCase = new CreatePersonUseCase(
  personRepository,
  createUserUseCase,
  personUniquenessService,
  uow,
);
const deletePersonUseCase = new DeletePersonUseCase(
  personRepository,
  userRepository,
  uow,
);
const searchPersonUseCase = new SearchPersonsUseCase(personRepository);
const getPersonUseCase = new GetPersonUseCase(personRepository);
const updatePersonUseCase = new UpdatePersonUseCase(
  personRepository,
  personUniquenessService,
  uow,
);

export const container = {
  userRepository,
  createUserUseCase,
  deleteUserUseCase,
  updateUserUseCase,
  searchUsersUseCase,
  listUsersUseCase,
  passwordHasher,
  refreshTokenUseCase,
  accessTokenService,
  loginUseCase,
  logoutUseCase,
  personRepository,
  createPersonUseCase,
  deletePersonUseCase,
  searchPersonUseCase,
  getPersonUseCase,
  updatePersonUseCase,
  uow,
};
