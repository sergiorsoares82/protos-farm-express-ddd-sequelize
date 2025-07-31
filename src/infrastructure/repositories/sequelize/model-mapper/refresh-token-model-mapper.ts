import { Uuid } from '../../../../domain/_shared/value-objects/uuid.vo';
import { RefreshTokenEntity } from '../../../../domain/auth/refresh-token.entity';
import { RefreshTokenModel } from '../models/refresh-token.model';

export class RefreshTokenModelMapper {
  static toEntity(model: RefreshTokenModel): RefreshTokenEntity {
    const token = new RefreshTokenEntity({
      token_id: new Uuid(model.token_id),
      user_id: new Uuid(model.user_id),
      token_hash: model.token_hash,
      expires_at: model.expires_at,
      created_at: model.created_at || new Date(),
    });
    return token;
  }

  static toModel(entity: RefreshTokenEntity): RefreshTokenModel {
    return RefreshTokenModel.build({
      token_id: entity.token_id.id,
      user_id: entity.user_id.id,
      token_hash: entity.token_hash,
      expires_at: entity.expires_at,
      created_at: entity.created_at,
    });
  }
}
