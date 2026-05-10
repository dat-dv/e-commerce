import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from './index';

describe('Footer Component', () => {
  it('should render the powered by text', () => {
    render(<Footer />);
    const footerText = screen.getByText(/Powered by datdoan.dev@gmail.com/i);
    expect(footerText).toBeInTheDocument();
  });
});
