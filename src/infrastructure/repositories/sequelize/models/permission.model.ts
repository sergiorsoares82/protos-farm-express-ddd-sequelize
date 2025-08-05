import { Model, Sequelize } from 'sequelize';
import { permissionSchemaFields } from '../schemas/permission.schema';

export class PermissionModel extends Model {
  declare permission_id: string;
  declare name: string;
  declare description: string;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initPermissionModel(sequelize: Sequelize) {
  PermissionModel.init(permissionSchemaFields, {
    sequelize,
    tableName: 'permissions',
    underscored: true,
    timestamps: false,
  });
}
