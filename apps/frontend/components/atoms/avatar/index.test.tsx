import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Avatar from './index';

describe('Avatar Component', () => {
  it('should render Image when url is provided', () => {
    render(<Avatar url="https://example.com/avatar.jpg" name="John Doe" size={100} />);
    const imageElement = screen.getByRole('img', { name: /user avatar/i });
    expect(imageElement).toBeInTheDocument();

    // next/image optimizes src
    const src = imageElement.getAttribute('src');
    expect(src).toContain(encodeURIComponent('https://example.com/avatar.jpg'));
  });

  it('should render fallback initial when no url is provided (with name)', () => {
    render(<Avatar name="John Doe" />);
    // Initial should be 'J'
    const fallback = screen.getByText('J');
    expect(fallback).toBeInTheDocument();
  });

  it('should render default fallback letter "U" when neither url nor name are provided', () => {
    render(<Avatar />);
    const fallback = screen.getByText('U');
    expect(fallback).toBeInTheDocument();
  });
});
