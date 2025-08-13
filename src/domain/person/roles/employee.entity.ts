// roles/UserRole.ts

import { RoleType, type Role } from '../role';

export class EmployeeRole implements Role {
  readonly type = RoleType.Employee;

  // Employee-specific properties (e.g., job title, department)
  constructor(
    public employeeId: string,
    public email: string,
  ) {}

  // Employee-specific methods here
}
