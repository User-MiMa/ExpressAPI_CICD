import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './drizzle/migrations',
  schema: './src/db/schema.js',
});
