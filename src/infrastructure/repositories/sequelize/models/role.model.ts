import { Model, Sequelize } from 'sequelize';
import { roleSchemaFields } from '../schemas/role.schema';

export class RoleModel extends Model {
  declare role_id: string;
  declare name: string;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initRoleModel(sequelize: Sequelize) {
  RoleModel.init(roleSchemaFields, {
    sequelize,
    tableName: 'roles',
    underscored: true,
    timestamps: false,
  });
}
