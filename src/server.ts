import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import router from './shared/interface/routes';
import { Sequelize, type Dialect } from 'sequelize';
import dbEnvironmentVariables from './shared/interface/config';

const app = express();

app.use(router);

app.get('/', (req, res) => {
  res.send('Welcome to Protos Farm API');
});

const sequelize = new Sequelize(
  dbEnvironmentVariables.POSTGRES_DB,
  dbEnvironmentVariables.POSTGRES_USER,
  dbEnvironmentVariables.POSTGRES_PASSWORD,
  {
    host: dbEnvironmentVariables.POSTGRES_HOST,
    dialect: dbEnvironmentVariables.POSTGRES_DIALECT as Dialect,
    port: Number(dbEnvironmentVariables.POSTGRES_PORT), // Change to the port you mapped in docker-compose
  },
);

console.log(sequelize);

// async function startServer() {
//   try {
//     await sequelize.authenticate();
//     console.log('🟢 Database connected');
//   } catch (error) {
//     console.error('🔴 Failed to connect to the database:', error);
//   }
// }
// startServer();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
