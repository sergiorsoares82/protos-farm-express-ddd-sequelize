import express from 'express';
import router from './shared/interface/routes';
import 'dotenv/config'; // Load environment variables from .env file
import { Sequelize } from 'sequelize';

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

const sequelize = new Sequelize(POSTGRES_DB, 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres', // or 'postgres', 'sqlite', etc.
  port: 5433, // Change to the port you mapped in docker-compose
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
