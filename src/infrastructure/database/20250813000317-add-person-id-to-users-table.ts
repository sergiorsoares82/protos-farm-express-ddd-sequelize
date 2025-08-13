import { QueryInterface, DataTypes } from 'sequelize';

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  await queryInterface.addColumn('users', 'person_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'persons',
      key: 'person_id',
    },
  });
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> {
  await queryInterface.removeColumn('users', 'person_id');
}
