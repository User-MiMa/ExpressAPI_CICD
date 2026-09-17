import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  async function submitEmail(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setEmail('');
        setStatus({ state: 'success', message: 'Successfully subscribed' });
      } else if (res.status === 409)
        setStatus({ state: 'error', message: 'Already subscribed' });
      else if (res.status === 400)
        setStatus({ state: 'error', message: 'Invalid email' });
      else
        setStatus({
          state: 'error',
          message: 'Something went wrong. Please try again later.',
        });
    } catch {
      setStatus({ state: 'error', message: 'Something went wrong. Try again' });
    }
  }

  return (
    <>
      <h1>Mystery Page</h1>
      <form onSubmit={submitEmail}>
        <label htmlFor="email">Enter your Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          value={email}
          id="email"
          name="mail"
          placeholder="yourEmail@mail.com"
        />
        <button>I want to know!</button>
      </form>
      {status.state != 'idle' && <p>{status.message}</p>}
    </>
  );
}
