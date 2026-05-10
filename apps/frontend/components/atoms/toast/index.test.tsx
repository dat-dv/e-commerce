import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AppToast from './index';

describe('AppToast Component', () => {
  it('should render ToastContainer without crashing', () => {
    const { container } = render(<AppToast />);
    // Ensure the container is added to the DOM
    expect(container).toBeInTheDocument();
  });
});
