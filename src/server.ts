import 'dotenv/config';
import express from 'express';
import { initAllModels } from './infrastructure/database/init-models';
import { runMigrations } from './infrastructure/database/migrator/run-migrations';
import { sequelize } from './infrastructure/database/sequelize';
import router from './interfaces/http/routes/routes';
import { errorHandler } from './interfaces/http/middlewares/error-handler.middleware';

const app = express();
app.use(express.json());

// Rotas
console.log('🔗 Registrando rotas...');
app.use(router);

app.get('/', (req, res) => {
  res.send('Welcome to Protos Farm API');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use(errorHandler);

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('🟢 Database connected');
    initAllModels(sequelize);
    console.log('✅ Models initialized.');
    await runMigrations();
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('🔴 Failed to connect to the database:', error);
    process.exit(1);
  }
}

async function startServer() {
  await initDatabase();

  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '0.0.0.0'; // Ou "127.0.0.1" para só IPv4 local

  const server = app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
  });

  // Trata erro caso a porta já esteja em uso
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
    } else {
      console.error('❌ Server error:', err);
    }
    process.exit(1);
  });
}

startServer();
