import { Model, Sequelize, Optional } from 'sequelize';
import { userSchemaFields } from '../schemas/user.schema';
import type { PermissionModel } from './permission.model';
import { RoleModel } from './role.model';

interface UserAttributes {
  user_id: string;
  person_id: string; // Foreign key to PersonModel
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  role_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'> {}

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare user_id: string;
  declare person_id: string;
  declare username: string;
  declare email: string;
  declare password: string;
  declare is_active: boolean;
  declare role_id?: string;
  declare created_at?: Date;
  declare updated_at?: Date;

  // Helper: get permissions
  async getPermissions(): Promise<PermissionModel[]> {
    const role = await RoleModel.findByPk(this.role_id, {
      include: ['permissions'],
    });
    return role ? (role as any).permissions : [];
  }

  // Helper: check if user has a permission
  async hasPermission(permissionNames: string | string[]): Promise<boolean> {
    const names = Array.isArray(permissionNames)
      ? permissionNames
      : [permissionNames];
    const permissions = await this.getPermissions();
    const userPermissions = permissions.map((p) => p.name);

    return names.some((name) => userPermissions.includes(name));
  }
}

export function initUserModel(sequelize: Sequelize) {
  UserModel.init(userSchemaFields, {
    sequelize,
    tableName: 'users',
    underscored: true,
    timestamps: false,
  });
}
