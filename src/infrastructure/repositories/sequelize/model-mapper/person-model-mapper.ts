import { Uuid } from '../../../../domain/_shared/value-objects/uuid.vo';
import { PersonEntity } from '../../../../domain/person/person.entity';
import { PersonModel } from '../models/person.model';
import { UserModelMapper } from './user-model-mapper';

export class PersonModelMapper {
  static toEntity(model: PersonModel): PersonEntity {
    return new PersonEntity({
      person_id: new Uuid(model.person_id),
      name: model.name,
      person_type: model.person_type,
      document_number: model.document_number,
      company_name: model.company_name,
      created_at: model.created_at,
      updated_at: model.updated_at,
      user: model.user ? UserModelMapper.toEntity(model.user) : undefined,
    });
  }

  static toModel(entity: PersonEntity): PersonModel {
    return PersonModel.build({
      person_id: entity.person_id.id,
      name: entity.name,
      person_type: entity.person_type,
      document_number: entity.document_number,
      company_name: entity.company_name, // Allow company_name to be null
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }
}
