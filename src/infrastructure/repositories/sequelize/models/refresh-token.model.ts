import { Model, Sequelize } from 'sequelize';
import { refreshTokenSchemaFields } from '../schemas/refresh-token.schema';

type RefreshTokenAttributes = {
  token_id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
};

export class RefreshTokenModel
  extends Model<RefreshTokenAttributes>
  implements RefreshTokenAttributes
{
  declare token_id: string;
  declare user_id: string;
  declare token_hash: string;
  declare expires_at: Date;
  declare created_at: Date;
}

export function initRefreshTokenModel(sequelize: Sequelize) {
  RefreshTokenModel.init(refreshTokenSchemaFields, {
    sequelize,
    tableName: 'refresh_tokens',
    underscored: true,
    timestamps: false,
  });
}
