import express from 'express';
import { validateDto } from '../middlewares/validation.middleware';
import { CreatePersonDTOSchema } from '../../dtos/person/create-person.dto';
import { PersonsController } from '../../controllers/persons.controller';
import { container } from '../../../infrastructure/container';

const controller = new PersonsController(
  container.createPersonUseCase,
  container.deletePersonUseCase,
  container.searchPersonUseCase,
  container.getPersonUseCase,
  container.updatePersonUseCase,
);

const personRoutes = express.Router();

personRoutes.post('/', validateDto(CreatePersonDTOSchema), controller.create);
personRoutes.delete('/:id', controller.delete);
personRoutes.get('/', controller.search);
personRoutes.get('/:id', controller.findById);
personRoutes.patch('/:id', controller.update);

export default personRoutes;
