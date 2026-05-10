import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMDXComponents } from './index';

describe('useMDXComponents', () => {
  const components = useMDXComponents({});

  it('should return an object containing common HTML tags', () => {
    expect(components).toHaveProperty('h1');
    expect(components).toHaveProperty('h2');
    expect(components).toHaveProperty('p');
    expect(components).toHaveProperty('a');
    expect(components).toHaveProperty('table');
  });

  it('should render h1 with correct styles', () => {
    const H1 = components.h1 as React.FC<{ children: React.ReactNode }>;
    render(<H1>Main Title</H1>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Main Title');
    expect(heading).toHaveClass('text-4xl');
  });

  it('should render blockquote with correct styles', () => {
    const Blockquote = components.blockquote as React.FC<{ children: React.ReactNode }>;
    render(<Blockquote>Quote content</Blockquote>);
    const quote = screen.getByText('Quote content');
    expect(quote.tagName).toBe('BLOCKQUOTE');
  });
});
