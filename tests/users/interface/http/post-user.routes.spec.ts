import request from 'supertest';
import { startApp } from '../../../utils/start-int-app';
import { Express } from 'express';

describe('Post User Routes Test Suite', () => {
  const ctx = startApp();
  let app: Express;
  beforeEach(() => {
    app = ctx.app;
  });

  it('should create a user in the database', async () => {
    const response = await request(app).post('/users').send({
      username: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
  });
});
