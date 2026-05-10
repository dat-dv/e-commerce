import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Portal from './index';

describe('Portal Component', () => {
  it('should render children into the document body', () => {
    render(
      <Portal>
        <div data-testid="portal-content">Portal Content Test</div>
      </Portal>,
    );
    const content = document.body.querySelector('[data-testid="portal-content"]');
    expect(content).toBeInTheDocument();
    expect(content?.textContent).toBe('Portal Content Test');
  });
});
