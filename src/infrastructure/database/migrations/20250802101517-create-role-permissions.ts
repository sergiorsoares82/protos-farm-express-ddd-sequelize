import { QueryInterface } from 'sequelize';
import { rolePermissionSchemaFields } from '../../repositories/sequelize/schemas/role-permission.schema';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.createTable(
    'role_permissions',
    rolePermissionSchemaFields,
  );
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.dropTable('role_permissions');
};
