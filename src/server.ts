import express from 'express';
import router from './shared/interface/routes';
import 'dotenv/config'; // Load environment variables from .env file
import { Sequelize, type Dialect } from 'sequelize';

const app = express();

app.use(router);

const POSTGRES_DB = process.env.POSTGRES_DB;
if (!POSTGRES_DB) {
  throw new Error('Environment variable POSTGRES_DB is not set');
}

const POSTGRES_USER = process.env.POSTGRES_USER;
if (!POSTGRES_USER) {
  throw new Error('Environment variable POSTGRES_USER is not set');
}

const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
if (!POSTGRES_PASSWORD) {
  throw new Error('Environment variable POSTGRES_PASSWORD is not set');
}

const POSTGRES_HOST = process.env.POSTGRES_HOST;
if (!POSTGRES_HOST) {
  throw new Error('Environment variable POSTGRES_HOST is not set');
}

const POSTGRES_DIALECT = process.env.POSTGRES_DIALECT;
if (!POSTGRES_DIALECT) {
  throw new Error('Environment variable POSTGRES_DIALECT is not set');
}

const POSTGRES_PORT = process.env.POSTGRES_PORT;
if (!POSTGRES_PORT) {
  throw new Error('Environment variable POSTGRES_PORT is not set');
}

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  dialect: POSTGRES_DIALECT as Dialect,
  port: Number(POSTGRES_PORT), // Change to the port you mapped in docker-compose
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('🟢 Database connected');
  } catch (error) {
    console.error('🔴 Failed to connect to the database:', error);
  }
}
startServer();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
