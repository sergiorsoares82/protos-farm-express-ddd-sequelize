// infrastructure/repositories/sequelize/repositories/refresh-token-sequelize.repository.ts
import { IRefreshTokenRepository } from '../../../../domain/auth/refresh-token.repository';
import { RefreshTokenEntity } from '../../../../domain/auth/refresh-token.entity';
import { RefreshTokenModel } from '../models/refresh-token.model';
import { RefreshTokenModelMapper } from '../model-mapper/refresh-token-model-mapper';
import { EntityNotFoundError } from '../../../../domain/_shared/errors/entity-not-found.error';

export class RefreshTokenSequelizeRepository
  implements IRefreshTokenRepository
{
  async create(token: RefreshTokenEntity): Promise<void> {
    const model = RefreshTokenModelMapper.toModel(token).toJSON();
    await RefreshTokenModel.create(model);
  }

  async findById(tokenId: string): Promise<RefreshTokenEntity | null> {
    const model = await RefreshTokenModel.findByPk(tokenId);
    if (!model) return null;
    return RefreshTokenModelMapper.toEntity(model);
  }

  async delete(tokenId: string): Promise<void> {
    const id = tokenId;
    const affectedRows = await RefreshTokenModel.destroy({
      where: { token_id: id },
    });
    if (affectedRows === 0) {
      throw new EntityNotFoundError(id, RefreshTokenEntity);
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    const id = userId;
    const affectedRows = await RefreshTokenModel.destroy({
      where: { user_id: id },
    });
    if (affectedRows === 0) {
      throw new EntityNotFoundError(id, RefreshTokenEntity);
    }
  }
}
