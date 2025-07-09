import express from 'express';
import router from './shared/interface/routes';
import { Sequelize } from 'sequelize';

const app = express();

app.use(router);

const sequelize = new Sequelize('protos-farm', 'postgres', 'postgres', {
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
