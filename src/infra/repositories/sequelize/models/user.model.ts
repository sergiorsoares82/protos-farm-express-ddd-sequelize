import { Model, Sequelize } from 'sequelize';
import { userSchemaFields } from '../schemas/user.schema';

type UserModelAttributes = typeof userSchemaFields;

export class UserModel extends Model<UserModelAttributes> {}

export function initUserModel(sequelize: Sequelize) {
  UserModel.init(userSchemaFields, {
    sequelize,
    tableName: 'users',
    underscored: true,
    timestamps: false,
  });
}
