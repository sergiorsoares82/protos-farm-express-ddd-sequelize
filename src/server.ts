import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import { sequelize } from './infra/database/sequelize';
import router from './interface/_shared/routes';
import { runMigrations } from './infra/database/migrator/run-migrations';
import { initAllModels } from './infra/database/init-models';

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.use(router);

app.get('/', (req, res) => {
  res.send('Welcome to Protos Farm API');
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('🟢 Database connected');
    initAllModels(sequelize);
    console.log('✅ Models initialized.');
    await runMigrations();
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('🔴 Failed to connect to the database:', error);
  }
}
startServer();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
