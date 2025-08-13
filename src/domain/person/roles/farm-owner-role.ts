// roles/UserRole.ts

import { RoleType, type Role } from '../role';

export class FarmOwnerRole implements Role {
  readonly type = RoleType.FarmerOwner;

  // FarmerOwner-specific properties (e.g., farm information)
  constructor(
    public farmOwnerId: string,
    public email: string,
  ) {}

  // FarmerOwner-specific methods here
}
