import express from 'express';
import getDb from './db/index.js';
import { subscribers } from './db/schema.js';
import validator from 'validator';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.send('App running');
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const email =
      typeof req.body?.email === 'string' ? req.body.email.trim() : '';

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const dataBase = getDb();

    const queryUserEmail = await dataBase
      .insert(subscribers)
      .values({ email: email })
      .onConflictDoNothing({ target: subscribers.email })
      .returning({ email: subscribers.email });

    if (queryUserEmail.length === 0) {
      return res.status(409).json({ error: 'Already subscribed' });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error ocurred' });
  }
});

app.use(express.static(distPath));

export { app };
