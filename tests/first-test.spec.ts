import dotenv from 'dotenv';
import dbEnvironmentVariables from '../src/shared/interface/config';
import { Sequelize } from 'sequelize';

dotenv.config({ path: '.env.test' });
describe('First Test Suite', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });
    await sequelize.sync();
  });
  it('should pass the first test', () => {
    console.log(process.env.NODE_ENV);
    console.log('dbEnvironmentVariables:', dbEnvironmentVariables);
    expect(true).toBe(true);
  });
});
