import { QueryInterface, DataTypes } from 'sequelize';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.addColumn('users', 'role_id', {
    type: DataTypes.UUID,
    references: { model: 'roles', key: 'role_id' },
    onDelete: 'SET NULL',
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.removeColumn('users', 'role_id');
};
