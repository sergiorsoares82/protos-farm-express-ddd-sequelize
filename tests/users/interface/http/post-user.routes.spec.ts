import request from 'supertest';
import { startApp } from '../../../utils/start-int-app';
import { Express } from 'express';

describe('Post User Routes Test Suite', () => {
  console.log('DB config', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
  });
  const ctx = startApp();
  let app: Express;
  beforeEach(() => {
    app = ctx.app;
  });

  it('should create a user in the database', async () => {
    const response = await request(app).post('/users').send({
      name: 'Alice',
      email: 'alice@example.com',
    });

    expect(response.status).toBe(201);
  });
});
