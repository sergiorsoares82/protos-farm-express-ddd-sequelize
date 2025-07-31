import type z from 'zod';
import type { IValidatorFields } from './validator-fields-interface';
import type { Notification } from './notification';
import { addZodErrorsToNotification } from './zod-to-notification.helper';

export abstract class ZodValidatorFields implements IValidatorFields {
  abstract schema: z.ZodObject<any>;
  private _errors: Record<string, string[]> | null = null;

  validate(
    notification: Notification,
    data: any,
    fields: string[] = [],
  ): boolean {
    // Pick only the requested fields (like your class-validator `groups`)
    const schema = fields.length
      ? this.schema.pick(Object.fromEntries(fields.map((f) => [f, true])))
      : this.schema;

    const result = schema.safeParse(data);

    if (!result.success) {
      addZodErrorsToNotification(result.error, notification);
      this._errors = notification.errorsAsObject(); // store for external use
      return false;
    }

    this._errors = null;
    return true;
  }

  get errors(): Record<string, string[]> | null {
    return this._errors;
  }
}
