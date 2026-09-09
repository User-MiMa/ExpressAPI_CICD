import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

function getDbUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL');
  }
  return process.env.DATABASE_URL;
}

const sql = neon(getDbUrl());
const db = drizzle({ client: sql });

export { sql, db };
