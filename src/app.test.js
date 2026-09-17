import request from 'supertest';
import { expect, describe, test } from 'vitest';
import { app } from './app.js';

describe('GET /', () => {
  test('Returns "App running"', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('App running');
  });
});
