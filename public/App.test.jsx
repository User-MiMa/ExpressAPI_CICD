import '@testing-library/jest-dom/vitest';
import { expect, test, describe, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { cleanup } from '@testing-library/react';

describe('Unit test suite', () => {
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
});
