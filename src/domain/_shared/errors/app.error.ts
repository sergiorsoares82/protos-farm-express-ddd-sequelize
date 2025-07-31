export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly errors: Record<string, string[]> = {},
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
