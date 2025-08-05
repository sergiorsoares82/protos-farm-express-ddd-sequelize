import 'dotenv/config';
import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import cors from 'cors';
import { initAllModels } from './infrastructure/database/init-models';
import { runMigrations } from './infrastructure/database/migrator/run-migrations';
import { sequelize } from './infrastructure/database/sequelize';
import router from './interfaces/http/routes/routes';
import { errorHandler } from './interfaces/http/middlewares/error-handler.middleware';

const app = express();
app.use(express.json());

// 🔐 CORS: env-based origins
const allowedOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
// Routes
console.log('🔗 Registrando rotas...');
app.use(router);

app.get('/', (req, res) => res.send('Welcome to Protos Farm API'));

// 404 & Error Handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
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

  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  const HTTP_PORT = Number(process.env.HTTP_PORT) || 3001;

  // Start HTTPS server
  if (process.env.NODE_ENV !== 'production') {
    const options = {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    };
    console.log('🔒 Starting HTTPS server...');
    https.createServer(options, app).listen(PORT, HOST, () => {
      console.log(`🚀 HTTPS Server running at https://${HOST}:${PORT}`);
      console.log(`🔐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });

    // Start HTTP server for redirection
    http
      .createServer((req, res) => {
        const host = req.headers.host?.replace(/:\d+$/, `:${PORT}`);
        const redirectUrl = `https://${host}${req.url}`;
        res.writeHead(301, { Location: redirectUrl });
        res.end();
      })
      .listen(HTTP_PORT, HOST, () => {
        console.log(
          `➡️  HTTP requests on port ${HTTP_PORT} will be redirected to HTTPS`,
        );
      });
  }

  // For production, you might want to use a reverse proxy like Nginx
  else {
    console.log('Starting server in production mode...');
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at https://${HOST}:${PORT}`);
      console.log(`🔐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  }
}

startServer();
