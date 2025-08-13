import { QueryInterface } from 'sequelize';
import { userSchemaFields } from '../../repositories/sequelize/schemas/user.schema';

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  await queryInterface.createTable('users', userSchemaFields);
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  await queryInterface.dropTable('users');
}
