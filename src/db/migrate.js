import 'dotenv/config';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './index.js';

try {
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
  // console.log('All migrations applied successfully');
} catch {
  // console.error('Migration failed', error);
  process.exitCode = 1;
}
