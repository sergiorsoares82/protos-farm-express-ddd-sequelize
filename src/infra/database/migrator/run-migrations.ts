// src/database/migration-runner.ts
import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from '../sequelize';

export const migrationRunner = new Umzug({
  migrations: {
    glob: 'src/infra/database/migrations/*.ts', // or .ts if using ts-node
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// Optional: expose convenience methods
export const runMigrations = async () => migrationRunner.up();
export const revertLastMigration = async () => migrationRunner.down();
