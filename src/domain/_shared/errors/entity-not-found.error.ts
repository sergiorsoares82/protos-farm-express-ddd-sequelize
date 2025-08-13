import type { Entity } from '../entity';
import { AppError } from './app.error';

export class EntityNotFoundError extends AppError {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const idsMessage = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityClass.name} Not Found using ID ${idsMessage}`);
    this.name = 'EntityNotFoundError';
  }
}
