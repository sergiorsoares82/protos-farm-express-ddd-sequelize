import request from 'supertest';
import {
  app,
  setupIntegrationTest,
} from '../../../utils/setup-integration-test';

setupIntegrationTest();

describe('Person Routes', () => {
  it('should create a new person', async () => {
    const response = await request(app).post('/persons').send({
      name: 'John Doe',
      person_type: 'física',
      document_number: '123456789',
      company_name: null,
      is_active: true,
      is_user: false,
      // user: {},
    });
    expect(response.status).toBe(201);
    console.log('response', response.body);
  });
});
