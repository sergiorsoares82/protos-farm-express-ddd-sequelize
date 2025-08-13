import { Sequelize } from 'sequelize';
import {
  initRefreshTokenModel,
  RefreshTokenModel,
} from '../repositories/sequelize/models/refresh-tokens.model';

import {
  initUserModel,
  UserModel,
} from '../repositories/sequelize/models/user.model';
import {
  initRoleModel,
  RoleModel,
} from '../repositories/sequelize/models/role.model';
import {
  initPermissionModel,
  PermissionModel,
} from '../repositories/sequelize/models/permission.model';
import {
  initRolePermissionModel,
  RolePermissionModel,
} from '../repositories/sequelize/models/role-permission.model';
import {
  initPersonModel,
  PersonModel,
} from '../repositories/sequelize/models/person.model';

export function initAllModels(sequelize: Sequelize) {
  initUserModel(sequelize);
  initRefreshTokenModel(sequelize);
  initRoleModel(sequelize);
  initPermissionModel(sequelize);
  initRolePermissionModel(sequelize);
  initPersonModel(sequelize);

  // Associations

  // Person ↔ User
  UserModel.belongsTo(PersonModel, { foreignKey: 'person_id', as: 'person' });
  PersonModel.hasOne(UserModel, { foreignKey: 'person_id', as: 'users' });

  // Roles ↔ Permissions
  RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
  });
  PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles',
  });

  // User ↔ Role
  UserModel.belongsTo(RoleModel, { foreignKey: 'role_id' });
  RoleModel.hasMany(UserModel, { foreignKey: 'role_id' });

  // User ↔ RefreshToken
  RefreshTokenModel.belongsTo(UserModel, { foreignKey: 'user_id' });
  UserModel.hasMany(RefreshTokenModel, { foreignKey: 'user_id' });
}
