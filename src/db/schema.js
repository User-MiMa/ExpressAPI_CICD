import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

const subscribers = pgTable('subscribers', {
  id: integer('id').primaryKey(),
  email: varchar('email', { length: 254 }).notNull().unique(),
});

export { subscribers };
