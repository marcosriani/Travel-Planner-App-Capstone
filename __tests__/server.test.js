const app = require('../src/server/index');
const supertest = require('supertest');
const request = supertest(app);

describe('Post endpoint', () => {
  it('/all', async (done) => {
    const response = await request.get('/all');
    expect(response.status).toBe(200);
    done();
  });
});
