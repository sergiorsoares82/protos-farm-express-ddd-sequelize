import { Sequelize } from 'sequelize-typescript';
import { initUserModel } from '../repositories/sequelize/models/user.model';
import { initRefreshTokenModel } from '../repositories/sequelize/models/refresh-token.model';

export function initAllModels(sequelize: Sequelize) {
  initUserModel(sequelize);
  initRefreshTokenModel(sequelize);
  // initAnimalModel(sequelize);
  // initFarmModel(sequelize);
}
