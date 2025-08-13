import { Application } from 'express';
import { Sequelize } from 'sequelize';
import { startApp } from './start-int-app';

export let app: Application;
export let sequelize: Sequelize;

export async function setupIntegrationTest() {
  beforeAll(async () => {
    const started = await startApp();
    app = started.app;
    sequelize = started.db;
    await sequelize.authenticate(); // aguarda conexão ativa
  });

  afterEach(async () => {
    // Trunca todas as tabelas para limpar dados entre testes
    const models = sequelize.models;
    await sequelize.query('SET session_replication_role = replica;');

    // Em vez de .truncate({ cascade: true }) use .destroy com truncate para evitar erros
    await Promise.all(
      Object.keys(models).map((key) =>
        models[key].destroy({ where: {}, truncate: true, cascade: true }),
      ),
    );

    await sequelize.query('SET session_replication_role = DEFAULT;');
  });

  afterAll(async () => {
    await sequelize.close();
  });
}
