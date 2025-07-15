import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import sequelizeOptions from '../../src/interface/_shared/interface/config';
import router from '../../src/interface/_shared/interface/routes';

export function startApp() {
  let app: Express;
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize(sequelizeOptions);
    await sequelize.sync({ force: true });

    app = express();
    app.use(express.json());
    app.use(router);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  return {
    get app() {
      if (!app) throw new Error('App not initialized');
      return app;
    },
    get db() {
      if (!sequelize) throw new Error('DB not initialized');
      return sequelize;
    },
  };
}
