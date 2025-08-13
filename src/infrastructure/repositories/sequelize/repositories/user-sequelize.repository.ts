import { Op } from 'sequelize';
import type { Uuid } from '../../../../domain/_shared/value-objects/uuid.vo';
import { UserEntity } from '../../../../domain/user/user.entity';
import {
  IUserRepository,
  UserSearchParams,
  UserSearchResult,
} from '../../../../domain/user/user.repository';
import { UserModelMapper } from '../model-mapper/user-model-mapper';
import { UserModel } from '../models/user.model';
import { EntityNotFoundError } from '../../../../domain/_shared/errors/entity-not-found.error';
import type { ITransaction } from '../../../../domain/_shared/repository/transaction.interface';
import type { SequelizeTransactionAdapter } from '../sequelize-transaction-adapter';

export class UserSequelizeRepository implements IUserRepository {
  sortableFields: string[] = ['name', 'email', 'created_at', 'updated_at'];

  constructor(private userModel: typeof UserModel) {}

  async insert(entity: UserEntity, transaction?: ITransaction): Promise<void> {
    try {
      console.log('userEntity', entity);
      const model = UserModelMapper.toModel(entity).toJSON();
      console.log('model', model);
      const options = transaction
        ? {
            transaction: (
              transaction as SequelizeTransactionAdapter
            ).getRawTransaction(),
          }
        : {};

      await this.userModel.create(model, {
        ...options,
      });
    } catch (error) {
      console.error('Erro ao inserir usuário:', error);
      throw error; // relança para tratamento externo se quiser
    }
  }

  async findById(entity_id: Uuid): Promise<UserEntity | null> {
    const model = await this.userModel.findByPk(entity_id.id);

    return model ? UserModelMapper.toEntity(model) : null;
  }

  async findByPersonId(
    personId: Uuid,
    transaction: SequelizeTransactionAdapter,
  ): Promise<UserEntity | null> {
    const model = await this.userModel.findOne({
      where: { person_id: personId.id },
      transaction: transaction.getRawTransaction(),
    });

    return model ? UserModelMapper.toEntity(model) : null;
  }

  async update(entity: UserEntity): Promise<void> {
    const id = entity.entity_id.id;

    const modelProps = UserModelMapper.toModel(entity);
    const [affectedRows] = await this.userModel.update(modelProps.toJSON(), {
      where: { user_id: id },
    });
    if (affectedRows !== 1) {
      throw new EntityNotFoundError(entity.entity_id, UserEntity);
    }
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;
    const affectedRows = await this.userModel.destroy({
      where: { user_id: id },
    });
    if (affectedRows === 0) {
      throw new EntityNotFoundError(entity_id, UserEntity);
    }
  }

  async bulkInsert(entities: UserEntity[]): Promise<void> {
    const models = entities.map((entity) => UserModelMapper.toModel(entity));
    await this.userModel.bulkCreate(models);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userModel.findAll();
    return users.map((userModel) => UserModelMapper.toEntity(userModel));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userModel = await this.userModel.findOne({
      where: { email },
    });
    return userModel ? UserModelMapper.toEntity(userModel) : null;
  }

  async search(props: UserSearchParams): Promise<UserSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const where = props.filter
      ? { username: { [Op.like]: `%${props.filter}%` } }
      : undefined;

    const order: [string, 'ASC' | 'DESC'][] =
      props.sort && this.sortableFields.includes(props.sort)
        ? [
            [
              props.sort,
              (props.sort_dir ?? 'desc').toUpperCase() as 'ASC' | 'DESC',
            ],
          ]
        : [['created_at', 'DESC']];
    const { rows: models, count } = await this.userModel.findAndCountAll({
      where,
      order,
      offset,
      limit,
    });
    return new UserSearchResult({
      items: models.map((model) => UserModelMapper.toEntity(model)),
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  getEntity(): new (...args: any[]) => UserEntity {
    return UserEntity;
  }
}
