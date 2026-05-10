import { render, renderHook, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import useLogin from '@/hooks/auth/use-login';
import { LoginSchema } from '@/hooks/auth/use-login/login.schema';

import SignInForm from './index';

vi.mock('@/hooks/auth/use-login', () => ({
  default: vi.fn(),
}));

describe('SignInForm Molecule', () => {
  const setupMock = (isLoading = false) => {
    const { result } = renderHook(() => useForm<LoginSchema>());
    vi.mocked(useLogin).mockReturnValue({
      handleLogin: vi.fn(),
      methods: result.current,
      isLoading,
    });
    return result.current;
  };

  it('should render email and password inputs', () => {
    setupMock();
    render(<SignInForm />);

    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('should display loading state', () => {
    setupMock(true);
    render(<SignInForm />);

    expect(screen.getByText(/Signing in.../i)).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: /Signing in.../i });
    expect(submitBtn).toBeDisabled();
  });
});
