import express, { Express } from 'express';
import pg from 'pg';
import { Sequelize } from 'sequelize';
import { initAllModels } from '../../src/infrastructure/database/init-models';
import { errorHandler } from '../../src/interfaces/http/middlewares/error-handler.middleware';
import router from '../../src/interfaces/http/routes/routes';

import { runMigrations } from '../../src/infrastructure/database/migrator/run-migrations';
import sequelizeOptions from '../../src/interfaces/_shared/config';

// async function ensureTestDatabase() {
//   const {
//     POSTGRES_USER,
//     POSTGRES_PASSWORD,
//     POSTGRES_HOST,
//     POSTGRES_PORT,
//     POSTGRES_DB,
//   } = process.env;

//   console.log('env vars', {
//     POSTGRES_USER,
//     POSTGRES_PASSWORD,
//     POSTGRES_HOST,
//     POSTGRES_PORT,
//     POSTGRES_DB,
//   });

//   if (!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB) {
//     throw new Error('Database env vars missing');
//   }

//   // Connect to the default postgres DB
//   const adminSequelize = new Sequelize({
//     dialect: 'postgres',
//     dialectModule: pg,
//     host: POSTGRES_HOST,
//     port: Number(POSTGRES_PORT),
//     username: POSTGRES_USER,
//     password: POSTGRES_PASSWORD,
//     database: 'postgres', // default db
//     logging: (msg) => {
//       if (msg.startsWith('Executing (default):')) return; // ignore some
//       console.log(msg);
//     },
//   });

//   // console.log('adminSequelize', adminSequelize);
//   console.log('start-int-app');

//   // Check/create the DB
//   const [results] = await adminSequelize.query(
//     `SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB}'`,
//   );

//   console.log('results', results);

//   if ((results as any[]).length === 0) {
//     await adminSequelize.query(`CREATE DATABASE "${POSTGRES_DB}"`);
//     console.log(`✅ Created database "${POSTGRES_DB}"`);
//   }

//   // await adminSequelize.close();
// }

export async function resetTestDatabase() {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
  } = process.env;

  if (
    !POSTGRES_USER ||
    !POSTGRES_PASSWORD ||
    !POSTGRES_DB ||
    !POSTGRES_HOST ||
    !POSTGRES_PORT
  ) {
    throw new Error('Database env vars missing');
  }

  const adminSequelize = new Sequelize({
    dialect: 'postgres',
    dialectModule: pg,
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: 'postgres',
    logging: false,
  });

  // Termina conexões abertas no banco de teste
  await adminSequelize.query(`
    SELECT pg_terminate_backend(pid) FROM pg_stat_activity
    WHERE datname = '${POSTGRES_DB}' AND pid <> pg_backend_pid();
  `);

  await adminSequelize.query(`DROP DATABASE IF EXISTS "${POSTGRES_DB}"`);
  await adminSequelize.query(`CREATE DATABASE "${POSTGRES_DB}"`);

  await adminSequelize.close();
}

export async function startApp() {
  // Reset DB before starting app & migrations
  await resetTestDatabase();

  const sequelize = new Sequelize(sequelizeOptions);
  try {
    await sequelize.authenticate();
    console.log('🟢 Database connected');
    initAllModels(sequelize);
    console.log('✅ Models initialized.');
    await runMigrations(sequelize);
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('🔴 Failed to connect to the database:', error);
    process.exit(1);
  }

  const app: Express = express();
  app.use(express.json());
  app.use(router);
  app.use(errorHandler); // precisa estar no final

  // beforeEach(async () => {
  //   await sequelize.sync({ force: true }); // garante DB limpo a cada teste
  // });

  // afterAll(async () => {
  //   await sequelize.close();
  // });

  return {
    app,
    db: sequelize,
  };
}
