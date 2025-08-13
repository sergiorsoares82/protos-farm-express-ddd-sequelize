import type { PersonOutput } from '../../application/use-cases/persons/dto/person-output';
import type { SearchPersonsOutput } from '../../application/use-cases/persons/search-persons.use-case';

export class PersonsPresenter {
  person_id: string;
  name: string;
  person_type: 'física' | 'jurídica';
  document_number: string;
  company_name: string | null; // Optional, if the user has a role
  user: { user_id: string; email: string; username: string };
  created_at: Date;
  updated_at: Date;

  constructor(person: PersonOutput) {
    this.person_id = person.person_id;
    this.name = person.name;
    this.person_type = person.person_type;
    this.document_number = person.document_number;
    this.company_name = person.company_name ?? null;
    this.user = {
      user_id: person.user.user_id,
      email: person.user.email,
      username: person.user.username,
    };
    this.created_at = person.created_at;
    this.updated_at = person.updated_at;
  }
}

export class PersonsCollectionPresenter {
  data: PersonsPresenter[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;

  constructor(output: SearchPersonsOutput) {
    this.data = output.items.map((i) => new PersonsPresenter(i));
    this.current_page = output.current_page;
    this.per_page = output.per_page;
    this.total = output.total;
    this.last_page = output.last_page;
  }
}
