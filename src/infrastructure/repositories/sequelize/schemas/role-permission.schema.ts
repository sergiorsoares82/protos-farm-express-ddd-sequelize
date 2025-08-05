import { DataTypes } from 'sequelize';

export const rolePermissionSchemaFields = {
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  permission_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
};
