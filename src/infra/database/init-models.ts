import { Sequelize } from 'sequelize-typescript';
import { initUserModel } from '../repositories/sequelize/models/user.model';

export function initAllModels(sequelize: Sequelize) {
  initUserModel(sequelize);
  // initAnimalModel(sequelize);
  // initFarmModel(sequelize);
}
