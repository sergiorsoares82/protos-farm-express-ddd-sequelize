import { QueryInterface } from 'sequelize';
import { userSchemaFields } from '../../repositories/sequelize/schemas/user.schema';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  queryInterface.createTable('users', userSchemaFields);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  queryInterface.dropTable('users');
};
