import type { PersonEntity } from '../../../../domain/person/person.entity';

export type PersonOutput = {
  person_id: string;
  name: string;
  person_type: 'física' | 'jurídica';
  document_number: string;
  company_name?: string;
  user: {
    user_id: string;
    email: string;
    username: string;
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export class PersonOutputMapper {
  static toOutput(person: PersonEntity): PersonOutput {
    return {
      person_id: person.person_id.id,
      name: person.name,
      person_type: person.person_type,
      document_number: person.document_number,
      company_name: person.company_name ?? undefined,
      user: {
        user_id: person._user?.user_id?.toString() ?? '',
        email: person._user?.email ?? '',
        username: person._user?.username ?? '',
      },
      is_active: person.is_active,
      created_at: person.created_at,
      updated_at: person.updated_at,
    };
  }
}
