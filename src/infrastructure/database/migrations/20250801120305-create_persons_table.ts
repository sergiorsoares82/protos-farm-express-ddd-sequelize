// 20250812120305-create_persons_table.ts
import type { QueryInterface } from 'sequelize';
import { personSchemaFields } from '../../repositories/sequelize/schemas/person.schema';

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}) {
  await queryInterface.createTable('persons', personSchemaFields);
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}) {
  await queryInterface.dropTable('persons');
}
