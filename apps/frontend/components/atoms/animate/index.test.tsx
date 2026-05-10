import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AnimationContainer, AnimationItem } from './index';

describe('components/atoms/animate: component checks', () => {
  describe('AnimationContainer', () => {
    it('should render children correctly', () => {
      render(
        <AnimationContainer>
          <span>Test Container Content</span>
        </AnimationContainer>,
      );

      expect(screen.getByText('Test Container Content')).toBeInTheDocument();
    });

    it('should apply the provided className', () => {
      render(
        <AnimationContainer data-testid="anim-container" className="my-custom-container-class">
          Content
        </AnimationContainer>,
      );

      const containerElement = screen.getByTestId('anim-container');
      expect(containerElement).toHaveClass('my-custom-container-class');
    });

    it('should pass other HTML/motion attributes correctly', () => {
      render(
        <AnimationContainer data-testid="anim-container" id="custom-id">
          Content
        </AnimationContainer>,
      );

      const containerElement = screen.getByTestId('anim-container');
      expect(containerElement).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('AnimationItem', () => {
    it('should render children correctly', () => {
      render(
        <AnimationItem>
          <span>Test Item Content</span>
        </AnimationItem>,
      );

      expect(screen.getByText('Test Item Content')).toBeInTheDocument();
    });

    it('should apply the provided className', () => {
      render(
        <AnimationItem data-testid="anim-item" className="my-custom-item-class">
          Content
        </AnimationItem>,
      );

      const itemElement = screen.getByTestId('anim-item');
      expect(itemElement).toHaveClass('my-custom-item-class');
    });

    it('should pass other HTML/motion attributes correctly', () => {
      render(
        <AnimationItem data-testid="anim-item" id="item-id">
          Content
        </AnimationItem>,
      );

      const itemElement = screen.getByTestId('anim-item');
      expect(itemElement).toHaveAttribute('id', 'item-id');
    });
  });
});
