import '@testing-library/jest-dom/vitest';
import { vi, expect, test, describe, afterEach, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mock = (status, body) =>
  vi.stubGlobal('fetch', vi.fn().
    mockResolvedValue(new Response(JSON.stringify(body), { status }))
  );

describe('Unit test suite', () => {
  beforeEach(() => { vi.unstubAllGlobals(); });
  afterEach(cleanup);
  test('Shows correct title', () => {
    render(<App />);

    expect(document.querySelector('h1').textContent).toBe('Mystery Page');
  });
  test('Displays expected form', () => {
    render(<App />);
    expect(document.querySelector('input')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your Email')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button').textContent).toBe('I want to know!');
  });
  test('200 -> success message + clears input', async () => {
    mock(200, { message: 'Successfully subscribed' });
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Enter your Email'), 'mail@mail.com');
    await user.click(screen.getByRole('button'));

    expect(await screen.findByText('Successfully subscribed')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your Email')).toHaveValue('');
  });
  test('409 -> error message', async () => {
    mock(409, { message: 'Already subscribed' });
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Enter your Email'), 'mail@mail.com');
    await user.click(screen.getByRole('button'));

    expect(await screen.findByText('Already subscribed')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your Email')).toHaveValue('mail@mail.com');
  });
  test('400 -> error message', async () => {
    mock(400, { message: 'Invalid email' });
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Enter your Email'), 'invalidMail@com');
    await user.click(screen.getByRole('button'));

    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your Email')).toHaveValue('invalidMail@com');
  });
  test('500 -> error message', async () => {
    mock(500, { message: 'Something went wrong. Please try again later.' });
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Enter your Email'), 'mail@mail.com');
    await user.click(screen.getByRole('button'));

    expect(await screen.findByText('Something went wrong. Please try again later.'));
  });
  test('Catch statement -> error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Enter your Email'), 'mail@mail.com');
    await user.click(screen.getByRole('button'));

    expect(await screen.findByText('Something went wrong. Try again'));
  });
});
