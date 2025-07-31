// sequelize-options.spec.ts
import type { SequelizeOptions } from 'sequelize-typescript';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('sequelizeOptions', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV }; // clone
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  const importConfig = async (): Promise<SequelizeOptions> => {
    const mod = await import('../../../src/interfaces/_shared/config');
    return mod.default as SequelizeOptions;
  };

  it('should return sqlite options when dialect is sqlite', async () => {
    process.env.POSTGRES_DIALECT = 'sqlite';
    process.env.DB_STORAGE = '/tmp/sqlite.db';

    const config = await importConfig();

    expect(config).toEqual({
      dialect: 'sqlite',
      storage: '/tmp/sqlite.db',
      logging: expect.any(Function), // Function for logging
    });
  });

  it('should default sqlite storage to :memory: if DB_STORAGE not set', async () => {
    process.env.POSTGRES_DIALECT = 'sqlite';

    const config = await importConfig();

    expect(config).toEqual({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: expect.any(Function),
    });
  });

  it('should return postgres options when dialect is postgres', async () => {
    process.env.POSTGRES_DIALECT = 'postgres';
    process.env.POSTGRES_HOST = 'localhost';
    process.env.POSTGRES_DB = 'test_db';
    process.env.POSTGRES_USER = 'test_user';
    process.env.POSTGRES_PASSWORD = 'secret';
    process.env.POSTGRES_PORT = '6543';

    const config = await importConfig();

    expect(config).toMatchObject({
      dialect: 'postgres',
      host: 'localhost',
      port: 6543,
      database: 'test_db',
      username: 'test_user',
      password: 'secret',
      logging: true,
    });
    expect(config).toHaveProperty('dialectModule');
  });

  it('should throw when POSTGRES_DIALECT is missing', async () => {
    delete process.env.POSTGRES_DIALECT;
    await expect(importConfig()).rejects.toThrow(
      'Environment variable POSTGRES_DIALECT is not set',
    );
  });

  it('should throw when postgres required variables are missing', async () => {
    process.env.POSTGRES_DIALECT = 'postgres';
    delete process.env.POSTGRES_HOST;
    await expect(importConfig()).rejects.toThrow(
      'Environment variable POSTGRES_HOST is not set',
    );
  });

  it('should throw for unsupported dialects', async () => {
    process.env.POSTGRES_DIALECT = 'mysql';
    await expect(importConfig()).rejects.toThrow(
      'Unsupported database dialect: mysql',
    );
  });
});
