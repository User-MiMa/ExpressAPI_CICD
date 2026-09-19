import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

export default async function globalSetup() {
  const url = process.env.DATABASE_URL_TEST;
  if (!url) {
    // console.log('globalSetup: no DATABASE_URL_TEST, skipping wipe');
    return;
  }
  const client = drizzle({ client: neon(url) });
  await client.execute(
    sql`DELETE FROM subscribers WHERE email LIKE 'it-%@example.com'`,
  );
  // console.log('globalSetup: test subscribers wiped');
}
