import { Model, Sequelize, type Optional } from 'sequelize';
import { personSchemaFields } from '../schemas/person.schema';
import type { UserModel } from './user.model';

interface PersonAttributes {
  person_id: string;
  name: string;
  person_type: 'física' | 'jurídica';
  document_number: string;
  company_name: string | null;
  is_active: boolean;
  user?: {
    user_id: string;
    username: string;
    email: string;
  };
  created_at?: Date;
  updated_at?: Date;
}
interface PersonCreationAttributes
  extends Optional<PersonAttributes, 'person_id'> {}

export class PersonModel
  extends Model<PersonAttributes, PersonCreationAttributes>
  implements PersonAttributes
{
  // helpful for TS
  declare person_id: string;
  declare name: string;
  declare person_type: 'física' | 'jurídica';
  declare document_number: string;
  declare company_name: string | null;
  declare is_active: boolean;
  declare user?: UserModel;
  declare created_at: Date;
  declare updated_at: Date;
}

export function initPersonModel(sequelize: Sequelize) {
  PersonModel.init(personSchemaFields, {
    sequelize,
    tableName: 'persons',
    underscored: true,
    timestamps: false,
  });
}
