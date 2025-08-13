import { AppError } from './app.error';

export class NameAlreadyInUseError extends AppError {
  constructor(name: string) {
    super('Name already in use', 409, {
      name: [`Name '${name}' is already in use.`],
    });
  }
}
