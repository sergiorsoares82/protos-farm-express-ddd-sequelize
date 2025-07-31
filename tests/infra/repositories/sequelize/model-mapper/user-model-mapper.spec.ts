import {
  InvalidUuidError,
  Uuid,
} from '../../../../../src/domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../../../src/domain/user/user.entity';
import { UserModelMapper } from '../../../../../src/infrastructure/repositories/sequelize/model-mapper/user-model-mapper';
import type { UserModel } from '../../../../../src/infrastructure/repositories/sequelize/models/user.model';

describe('UserModelMapper', () => {
  const validModel: UserModel = {
    user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'hashed_password',
    is_active: true,
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-02T00:00:00Z'),
  } as UserModel;

  it('should map a valid model to a UserEntity', () => {
    const entity = UserModelMapper.toEntity(validModel);

    expect(entity).toBeInstanceOf(UserEntity);
    expect(entity.user_id).toBeInstanceOf(Uuid);
    expect(entity.user_id.id).toBe(validModel.user_id);
    expect(entity.username).toBe(validModel.username);
    expect(entity.email).toBe(validModel.email);
    expect(entity.password).toBe(validModel.password);
    expect(entity.is_active).toBe(validModel.is_active);
    expect(entity.created_at).toEqual(validModel.created_at);
    expect(entity.updated_at).toEqual(validModel.updated_at);
  });

  it('should throw InvalidUuidError for an invalid UUID', () => {
    const invalidModel = {
      ...validModel,
      user_id: 'invalid-uuid',
    } as UserModel;
    expect(() => UserModelMapper.toEntity(invalidModel)).toThrow(
      InvalidUuidError,
    );
  });

  it('should map correctly even if is_active is false', () => {
    const inactiveModel = { ...validModel, is_active: false } as UserModel;
    const entity = UserModelMapper.toEntity(inactiveModel);
    expect(entity.is_active).toBe(false);
  });

  it('should preserve date instances', () => {
    const entity = UserModelMapper.toEntity(validModel);
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(entity.updated_at).toBeInstanceOf(Date);
  });
});
