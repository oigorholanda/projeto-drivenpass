import httpStatus from 'http-status';
import supertest from 'supertest';
import app from '../../src/app.js';

beforeAll(async () => {
  //await init();
});

const server = supertest(app);

describe('GET /health', () => {
  it('should respond with status 200 with OK! text', async () => {
    const response = await server.get('/health');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.text).toBe('OK!');
  });
});
