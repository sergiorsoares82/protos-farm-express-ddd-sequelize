export interface EntityValidator<T> {
  validate(entity: T): boolean;
  readonly errors: Record<string, string[]> | null;
}
