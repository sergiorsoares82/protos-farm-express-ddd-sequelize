import { AppError } from './app.error';

export class EmailAlreadyInUseError extends AppError {
  constructor(email: string) {
    super('Email already in use', 409, {
      email: [`Email '${email}' is already in use.`],
    });
  }
}
