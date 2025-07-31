import { QueryInterface } from 'sequelize';
import { refreshTokenSchemaFields } from '../../repositories/sequelize/schemas/refresh-token.schema';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  queryInterface.createTable('refresh_tokens', refreshTokenSchemaFields);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  queryInterface.dropTable('refresh_tokens');
};
