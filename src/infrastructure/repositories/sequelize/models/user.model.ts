import { Model, Sequelize } from 'sequelize';
import { userSchemaFields } from '../schemas/user.schema';

type UserModelAttributes = {
  user_id: string;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export class UserModel
  extends Model<UserModelAttributes>
  implements UserModelAttributes
{
  declare user_id: string;
  declare username: string;
  declare email: string;
  declare password: string;
  declare is_active: boolean;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initUserModel(sequelize: Sequelize) {
  UserModel.init(userSchemaFields, {
    sequelize,
    tableName: 'users',
    underscored: true,
    timestamps: false,
  });
}
