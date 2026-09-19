import request from 'supertest';
import { vi, beforeEach, expect, describe, test } from 'vitest';
import { app } from './app.js';
import getDb from './db/index.js';
import { store, seedFakeDb, resetFakeDb } from './fakeDb.js';

vi.mock('./db/index.js', () => ({ default: vi.fn() }));

beforeEach(() => {
  resetFakeDb();
  seedFakeDb(getDb);
});

describe('GET /api/health', () => {
  test('Returns "App running"', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.text).toBe('App running');
  });
});

describe('POST /api/subscribers', () => {
  test('Subscribe new email -> 200 + trimmed & stored', async () => {
    const res = await request(app)
      .post('/api/subscribers')
      .send({ email: ' a@b.com   ' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Successfully subscribed' });
    expect(store.has('a@b.com')).toBe(true);
    expect(store.has(' a@b.com   ')).toBe(false);
  });

  test('Subscribe used email -> 409 + stored', async () => {
    const res = await request(app)
      .post('/api/subscribers')
      .send({ email: 'b@c.com' });

    const res2 = await request(app)
      .post('/api/subscribers')
      .send({ email: 'b@c.com' });

    expect(res2.status).toBe(409);
    expect(res2.body).toEqual({ error: 'Already subscribed' });
    expect(store.has('b@c.com')).toBe(true);
  });

  test('Subscribe invalid email -> 400 + not stored', async () => {
    const res = await request(app)
      .post('/api/subscribers')
      .send({ email: 'invalidEmail.com' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid email' });
    expect(store.has('invalidEmail.com')).toBe(false);
  });

  test('Missing email field -> 400 + no storage', async () => {
    const res = await request(app).post('/api/subscribers').send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid email' });
    expect(store.size).toBe(0);
    expect(getDb).not.toHaveBeenCalled();
  });

  test('Database throws -> 500', async () => {
    getDb.mockImplementation(() => {
      throw new Error('db down');
    });
    const res = await request(app)
      .post('/api/subscribers')
      .send({ email: 'a@b.com' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'An error ocurred' });
  });
});
