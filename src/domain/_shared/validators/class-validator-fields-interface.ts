export type FieldsErrors = {
  [field: string]: string[];
};

export interface IClassValidatorFields<PropsValidated> {
  errors: FieldsErrors | null;
  validatedData: PropsValidated | null;
  validate(data: unknown): boolean;
}
