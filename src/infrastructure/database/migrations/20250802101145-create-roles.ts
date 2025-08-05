import { QueryInterface } from 'sequelize';
import { roleSchemaFields } from '../../repositories/sequelize/schemas/role.schema';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.createTable('roles', roleSchemaFields);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.dropTable('roles');
};
