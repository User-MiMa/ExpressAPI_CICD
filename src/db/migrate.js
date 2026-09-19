import 'dotenv/config';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import getDb from './index.js';

try {
  await migrate(getDb(), { migrationsFolder: './drizzle/migrations' });
  // console.log('All migrations applied successfully');
} catch {
  // eslint-disable-next-line no-console
  console.error('Migration failed', error);
  process.exitCode = 1;
}
