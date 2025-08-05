import { QueryInterface } from 'sequelize';
import { permissionSchemaFields } from '../../repositories/sequelize/schemas/permission.schema';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.createTable('permissions', permissionSchemaFields);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.dropTable('permissions');
};
