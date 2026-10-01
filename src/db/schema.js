import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  emailAdress: varchar('email_adress', { length: 254 }).notNull().unique(),
});

export { subscribers };
