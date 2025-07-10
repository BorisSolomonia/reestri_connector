import { render, screen } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';
import type { ReactNode } from 'react';

vi.mock('./firebase', () => ({
  auth: {},
  db: {},
}));

vi.mock('./AuthProvider', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({ user: null, signInWithGoogle: () => {} }),
}));

import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders sign in button when not authenticated', () => {
    render(<App />);
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
  });
}); 