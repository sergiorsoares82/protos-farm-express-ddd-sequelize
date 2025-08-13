import type { Request, Response } from 'express';
import type { CreatePersonUseCase } from '../../application/use-cases/persons/create-person.use-case';
import type { DeletePersonUseCase } from '../../application/use-cases/persons/delete-person.use-case';
import type { PersonOutput } from '../../application/use-cases/persons/dto/person-output';
import type { GetPersonUseCase } from '../../application/use-cases/persons/get-person.use-case';
import type { SearchPersonsUseCase } from '../../application/use-cases/persons/search-persons.use-case';
import { SearchPersonsDTOSchema } from '../dtos/person/search-persons.dto';
import {
  PersonsCollectionPresenter,
  PersonsPresenter,
} from '../presenters/persons.presenter';
import type { UpdatePersonUseCase } from '../../application/use-cases/persons/update-person.use-case';

export class PersonsController {
  constructor(
    private readonly createPersonUseCase: CreatePersonUseCase,
    private readonly deletePersonUseCase: DeletePersonUseCase,
    private readonly searchPersonsUseCase: SearchPersonsUseCase,
    private readonly getPersonUseCase: GetPersonUseCase,
    private readonly updatePersonUseCase: UpdatePersonUseCase,
  ) {}
  create = async (req: Request, res: Response) => {
    const personData = req.body;
    const result = await this.createPersonUseCase.execute(personData);
    return res.status(201).json(result);
  };

  delete = async (req: Request, res: Response) => {
    const personId = req.params.id;
    await this.deletePersonUseCase.execute({ person_id: personId });
    return res.status(204).send();
  };

  findById = async (req: Request, res: Response) => {
    const personId = req.params.id;
    const result = await this.getPersonUseCase.execute({ person_id: personId });
    return res.status(200).json(result);
  };

  // findAll = async (req: Request, res: Response) => {
  //   const users = await this.listUsersUseCase.execute();
  //   return res.status(200).json(users.map(UsersController.serializeUser));
  // };

  search = async (req: Request, res: Response) => {
    const result = SearchPersonsDTOSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    const output = await this.searchPersonsUseCase.execute(result.data);
    return res.status(200).json(new PersonsCollectionPresenter(output));
  };

  update = async (req: Request, res: Response) => {
    const personId = req.params.id;
    const personData = req.body;
    await this.updatePersonUseCase.execute({
      person_id: personId,
      ...personData,
    });
    return res.status(204).send();
  };

  static serializeUser(user: PersonOutput) {
    return new PersonsPresenter(user);
  }
}
