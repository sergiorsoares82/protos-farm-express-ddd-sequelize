import { Op } from 'sequelize';
import { EntityNotFoundError } from '../../../../domain/_shared/errors/entity-not-found.error';
import type { Uuid } from '../../../../domain/_shared/value-objects/uuid.vo';
import { PersonEntity } from '../../../../domain/person/person.entity';
import {
  IPersonRepository,
  PersonSearchParams,
  PersonSearchResult,
} from '../../../../domain/person/person.repository';
import { PersonModelMapper } from '../model-mapper/person-model-mapper';
import type { PersonModel } from '../models/person.model';
import type { SequelizeTransactionAdapter } from '../sequelize-transaction-adapter';
import { UserModel } from '../models/user.model';

export class PersonSequelizeRepository implements IPersonRepository {
  sortableFields: string[] = ['name', 'created_at', 'updated_at'];

  constructor(private personModel: typeof PersonModel) {}

  async existsByName(name: string, ignoreId?: Uuid): Promise<boolean> {
    const where: any = { name: name };
    if (ignoreId?.id) {
      where.person_id = { [Op.ne]: ignoreId.id };
    }
    const count = await this.personModel.count({
      where,
    });
    return count > 0;
  }

  async existsByDocumentNumber(
    documentNumber: string,
    ignoreId?: Uuid,
  ): Promise<boolean> {
    const where: any = { document_number: documentNumber };
    if (ignoreId?.id) {
      where.person_id = { [Op.ne]: ignoreId.id };
    }
    const count = await this.personModel.count({
      where,
    });
    console.log('count', count);
    return count > 0;
  }

  async insert(
    entity: PersonEntity,
    transaction: SequelizeTransactionAdapter,
  ): Promise<void> {
    const model = PersonModelMapper.toModel(entity).toJSON();

    try {
      await this.personModel.create(model, {
        transaction: transaction.getRawTransaction(),
        logging: console.log,
      });
    } catch (err) {
      console.error('Insert failed:', err);
      throw err;
    }
  }

  async findById(entity_id: Uuid): Promise<PersonEntity | null> {
    const model = await this.personModel.findByPk(entity_id.id, {
      include: [{ model: UserModel, as: 'users' }],
    });

    return model ? PersonModelMapper.toEntity(model) : null;
  }

  async update(
    entity: PersonEntity,
    transaction: SequelizeTransactionAdapter,
  ): Promise<void> {
    const id = entity.entity_id.id;

    const modelProps = PersonModelMapper.toModel(entity);
    const [affectedRows] = await this.personModel.update(modelProps.toJSON(), {
      where: { person_id: id },
      transaction: transaction.getRawTransaction(),
    });

    if (affectedRows !== 1) {
      throw new EntityNotFoundError(entity.entity_id, PersonEntity);
    }
  }

  async delete(
    entity_id: Uuid,
    transaction: SequelizeTransactionAdapter,
  ): Promise<void> {
    const id = entity_id.id;
    const affectedRows = await this.personModel.destroy({
      where: { person_id: id },
      transaction: transaction.getRawTransaction(),
    });
    if (affectedRows === 0) {
      throw new EntityNotFoundError(entity_id, PersonEntity);
    }
  }

  async bulkInsert(
    entities: PersonEntity[],
    transaction: SequelizeTransactionAdapter,
  ): Promise<void> {
    const models = entities.map((entity) => PersonModelMapper.toModel(entity));
    await this.personModel.bulkCreate(models, {
      transaction: transaction.getRawTransaction(),
    });
  }

  async findAll(): Promise<PersonEntity[]> {
    const users = await this.personModel.findAll();
    return users.map((userModel) => PersonModelMapper.toEntity(userModel));
  }

  async findByName(name: string): Promise<PersonEntity | null> {
    const userModel = await this.personModel.findOne({
      where: { name },
    });
    return userModel ? PersonModelMapper.toEntity(userModel) : null;
  }

  async search(props: PersonSearchParams): Promise<PersonSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const where = props.filter
      ? { name: { [Op.like]: `%${props.filter}%` } }
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
    const { rows: models, count } = await this.personModel.findAndCountAll({
      where,
      order,
      offset,
      limit,
      include: [{ model: UserModel, as: 'users' }],
    });

    const transformedResult = models.map((model) =>
      PersonModelMapper.toEntity(model),
    );
    console.log('transformedResult', transformedResult);
    return new PersonSearchResult({
      items: models.map((model) => PersonModelMapper.toEntity(model)),
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  getEntity(): new (...args: any[]) => PersonEntity {
    return PersonEntity;
  }
}
