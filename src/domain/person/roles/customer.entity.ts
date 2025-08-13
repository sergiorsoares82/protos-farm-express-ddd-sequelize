import z from 'zod';
import { Uuid } from '../../_shared/value-objects/uuid.vo';
import { Entity } from '../../_shared/entity';

type CustomerConstructorProps = {
  customer_id?: Uuid;
  category: string;
  is_active?: boolean;
};

export const CustomerBaseSchema = z.object({
  category: z.string().min(2).max(100),
  is_active: z.boolean().optional().default(true),
});

export const CustomerFullSchema = CustomerBaseSchema.extend({
  customer_id: z.instanceof(Uuid).optional(),
});

export type CustomerCreateProps = z.input<typeof CustomerBaseSchema>;

export class CustomerRole extends Entity {
  // Customer-specific properties (e.g., billing information)
  _customer_id: Uuid;
  _category: string;
  _is_active: boolean;
  constructor(props: CustomerConstructorProps) {
    super();
    this._customer_id = props.customer_id || new Uuid();
    this._category = props.category;
    this._is_active = props.is_active ?? true;
  }

  get entity_id(): Uuid {
    return this._customer_id;
  }

  get customer_id(): Uuid {
    return this._customer_id;
  }

  get category(): string {
    return this._category;
  }

  get is_active(): boolean {
    return this._is_active;
  }

  // --- Factory for safe creation ---
  static create(props: CustomerCreateProps): CustomerRole {
    const customer = new CustomerRole(props);
    return customer;
  }

  // --- Update methods (always revalidate & touch updated_at) ---
  changeCategory(newCategory: string): void {
    this._category = newCategory;
  }

  changeStatus(isActive: boolean): void {
    this._is_active = isActive;
  }

  toJSON(): CustomerConstructorProps {
    return {
      customer_id: this._customer_id,
      category: this._category,
      is_active: this._is_active,
    };
  }
}
