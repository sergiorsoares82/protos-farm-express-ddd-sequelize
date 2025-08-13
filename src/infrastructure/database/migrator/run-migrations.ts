// src/database/migration-runner.ts
import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';

export function createMigrationRunner(sequelize: Sequelize) {
  if (!sequelize) {
    throw new Error('Sequelize instance is not initialized');
  }
  const queryInterface = sequelize.getQueryInterface();
  return new Umzug({
    migrations: {
      glob: 'src/infrastructure/database/migrations/*.ts',
    },
    context: queryInterface,
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
}

export async function runMigrations(sequelize: Sequelize) {
  const runner = createMigrationRunner(sequelize);
  await runner.up();
}

// Optional: expose convenience methods
export const revertLastMigration = async (sequelize: Sequelize) => {
  const runner = createMigrationRunner(sequelize);
  await runner.down();
};
