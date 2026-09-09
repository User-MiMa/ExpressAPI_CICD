import 'dotenv/config';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './index.js';

try {
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
} catch (error) {
  console.error('Migration failed', error);
  process.exitCode = 1;
}
