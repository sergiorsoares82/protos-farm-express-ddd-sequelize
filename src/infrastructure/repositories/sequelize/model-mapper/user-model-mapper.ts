import { Uuid } from '../../../../domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../../domain/user/user.entity';
import { UserModel } from '../models/user.model';

export class UserModelMapper {
  static toEntity(model: UserModel): UserEntity {
    const user = new UserEntity({
      user_id: new Uuid(model.user_id),
      username: model.username,
      email: model.email,
      password: model.password,
      is_active: model.is_active,
      created_at: model.created_at,
      updated_at: model.updated_at,
    });
    return user;
  }

  static toModel(entity: UserEntity): UserModel {
    return UserModel.build({
      user_id: entity.user_id.id,
      username: entity.username,
      email: entity.email,
      password: entity.password,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
