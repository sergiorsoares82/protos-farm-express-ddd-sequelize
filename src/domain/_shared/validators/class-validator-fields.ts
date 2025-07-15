import { validateSync } from 'class-validator';
import {
  FieldsErrors,
  IClassValidatorFields,
} from './class-validator-fields-interface';

export abstract class ClassValidatorFields<PropsValidated>
  implements IClassValidatorFields<PropsValidated>
{
  errors: FieldsErrors | null = null;
  validatedData: PropsValidated | null = null;

  validate(data: unknown): boolean {
    const errors = validateSync(data as object);
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints!);
      }
    } else {
      this.validatedData = data as PropsValidated;
    }
    return !errors.length;
  }
}
