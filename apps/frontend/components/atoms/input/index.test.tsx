import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Input from './index';

describe('Input Component', () => {
  it('should render standard text input with label', () => {
    render(<Input label="Username" id="user" placeholder="Enter username" />);
    const labelElement = screen.getByText('Username');
    expect(labelElement).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText('Enter username');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  it('should apply disabled attributes when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled Area" id={''} />);
    const inputElement = screen.getByPlaceholderText('Disabled Area');
    expect(inputElement).toBeDisabled();
  });

  it('should toggle password visibility', () => {
    render(<Input type="password" id="pass" placeholder="Password" />);
    const inputElement = screen.getByPlaceholderText('Password');

    // Initially, it should be type password
    expect(inputElement).toHaveAttribute('type', 'password');

    // Click to show password
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'text');

    // Click to hide again
    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('should show error message', () => {
    render(<Input error="Invalid field data" placeholder="Email" />);
    const errorMessage = screen.getByText('Invalid field data');
    expect(errorMessage).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText('Email');
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
  });
});
