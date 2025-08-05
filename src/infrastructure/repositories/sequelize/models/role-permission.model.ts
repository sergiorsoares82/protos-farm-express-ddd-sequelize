import { Model, Sequelize, DataTypes } from 'sequelize';

export class RolePermissionModel extends Model {
  declare role_id: string;
  declare permission_id: string;
}

export function initRolePermissionModel(sequelize: Sequelize) {
  RolePermissionModel.init(
    {
      role_id: { type: DataTypes.UUID, allowNull: false },
      permission_id: { type: DataTypes.UUID, allowNull: false },
    },
    { sequelize, tableName: 'role_permissions', timestamps: false },
  );
}
