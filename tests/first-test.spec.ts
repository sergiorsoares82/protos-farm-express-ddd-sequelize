import dotenv from 'dotenv';
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
    expect(true).toBe(true);
  });
});
