import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let db = null;

export default function getDb() {
  if (db) return db;
  if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL');
  }
  db = drizzle({ client: neon(process.env.DATABASE_URL) });
  return db;
}
