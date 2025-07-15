import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import sequelizeOptions from './shared/interface/config';
import router from './shared/interface/routes';

const app = express();

app.use(router);

app.get('/', (req, res) => {
  res.send('Welcome to Protos Farm API');
});

const sequelize = new Sequelize({ ...sequelizeOptions });

console.log(process.env.NODE_ENV);
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
