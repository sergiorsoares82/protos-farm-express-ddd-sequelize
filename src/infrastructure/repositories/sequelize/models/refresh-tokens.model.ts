import { Model, Sequelize } from 'sequelize';
import { refreshTokenSchemaFields } from '../schemas/refresh-tokens.schema';

export class RefreshTokenModel extends Model {
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
