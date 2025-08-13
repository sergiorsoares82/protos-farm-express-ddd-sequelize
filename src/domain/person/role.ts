export interface Role {
  type: RoleType;
  // You can add role-specific methods here
}

export enum RoleType {
  User = 'User',
  Customer = 'Customer',
  Vendor = 'Vendor',
  FarmerOwner = 'FarmerOwner',
  Employee = 'Employee',
}
