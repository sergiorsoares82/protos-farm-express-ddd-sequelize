export class UnauthorizedError extends Error {
  constructor() {
    super(`Unauthorized access`);
    this.name = 'UnauthorizedError';
  }
}
