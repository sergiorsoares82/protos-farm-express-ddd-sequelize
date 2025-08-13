// Person.ts
import z from 'zod';
import { Entity } from '../_shared/entity';
import { Uuid } from '../_shared/value-objects/uuid.vo';
import { PersonValidatorFactory } from './person.validator';
import type { UserEntity } from '../user/user.entity';

type PersonConstructorProps = {
  person_id?: Uuid;
  name: string;
  person_type: 'física' | 'jurídica';
  document_number: string;
  company_name?: string | null;
  is_active?: boolean;
  user?: UserEntity;
  created_at?: Date;
  updated_at?: Date;
};

export const PersonBaseSchema = z.object({
  name: z.string().min(2).max(100),
  person_type: z.enum(['física', 'jurídica']),
  document_number: z.string().min(5).max(20),
  company_name: z.string().min(2).max(100).optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

export const PersonFullSchema = PersonBaseSchema.extend({
  person_id: z.instanceof(Uuid).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type PersonCreateProps = z.input<typeof PersonBaseSchema>;

export class PersonEntity extends Entity {
  _person_id: Uuid;
  _name: string;
  _person_type: 'física' | 'jurídica';
  _document_number: string;
  _company_name?: string | null;
  _is_active: boolean;
  _user?: UserEntity;
  _created_at: Date;
  _updated_at: Date;

  constructor(props: PersonConstructorProps) {
    super();
    this._person_id = props.person_id || new Uuid();
    this._name = props.name;
    this._person_type = props.person_type;
    this._document_number = props.document_number;
    this._company_name = props.company_name ?? null;
    this._is_active = props.is_active ?? true;
    this._user = props.user;
    this._created_at = props.created_at ?? new Date();
    this._updated_at = props.updated_at ?? new Date();
    PersonEntity.validate(this);
  }

  get entity_id(): Uuid {
    return this._person_id;
  }

  get person_id(): Uuid {
    return this._person_id;
  }

  get name(): string {
    return this._name;
  }

  get person_type(): 'física' | 'jurídica' {
    return this._person_type;
  }

  get document_number(): string {
    return this._document_number;
  }

  get company_name(): string | null {
    return this._company_name || null;
  }

  get is_active(): boolean {
    return this._is_active;
  }

  get user(): UserEntity | undefined {
    return this._user;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  static create(props: PersonCreateProps): PersonEntity {
    const person = new PersonEntity(props);
    return person;
  }

  changeName(name: string): void {
    this._name = name;
    PersonEntity.validate(this);
    this.touch();
  }

  changeDocumentNumber(document_number: string): void {
    this._document_number = document_number;
    PersonEntity.validate(this);
    this.touch();
  }

  changeCompanyName(company_name: string | undefined): void {
    this._company_name = company_name;
    PersonEntity.validate(this);
    this.touch();
  }

  private touch(): void {
    this._updated_at = new Date();
  }

  static validate(person: PersonEntity): boolean {
    const validator = PersonValidatorFactory.create();
    return validator.validate(person.notification, person);
  }

  toJSON(): PersonConstructorProps {
    return {
      person_id: this._person_id,
      name: this._name,
      person_type: this._person_type,
      document_number: this._document_number,
      company_name: this._company_name,
      is_active: this._is_active,
      user: this._user,
      created_at: this._created_at,
      updated_at: this._updated_at,
    };
  }
}
