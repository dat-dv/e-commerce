import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { DocsAnimationWrapper } from './index';

describe('DocsAnimationWrapper Component', () => {
  it('should render children correctly', () => {
    render(
      <DocsAnimationWrapper>
        <div data-testid="child">Test Child</div>
      </DocsAnimationWrapper>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should render the motion div wrapper', () => {
    render(
      <DocsAnimationWrapper>
        <div>Content</div>
      </DocsAnimationWrapper>,
    );

    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toBeInTheDocument();
    expect(motionDiv).toHaveClass('relative w-full');
  });
});
