// roles/UserRole.ts

import { RoleType, type Role } from '../role';

export class VendorRole implements Role {
  readonly type = RoleType.Vendor;

  // Vendor-specific properties (e.g., shop information)
  constructor(
    public vendorId: string,
    public email: string,
  ) {}

  // Vendor-specific methods here
}
