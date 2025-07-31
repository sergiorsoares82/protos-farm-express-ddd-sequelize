import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import sequelizeOptions from '../../src/interfaces/_shared/config';
import router from '../../src/interfaces/http/routes/routes';
import { errorHandler } from '../../src/interfaces/http/middlewares/error-handler.middleware';
import { initAllModels } from '../../src/infrastructure/database/init-models';

export function startApp() {
  const sequelize = new Sequelize(sequelizeOptions);
  initAllModels(sequelize);

  const app: Express = express();
  app.use(express.json());
  app.use(router);
  app.use(errorHandler); // precisa estar no final

  beforeEach(async () => {
    await sequelize.sync({ force: true }); // garante DB limpo a cada teste
  });

  afterAll(async () => {
    await sequelize.close();
  });

  return {
    app,
    db: sequelize,
  };
}
