// index.test.tsx
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CopyButton } from '.';

describe('CopyButton Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    // Mock clipboard before each test
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined), // <-- spy
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should copy text to clipboard when clicked', async () => {
    const codeSnippet = 'const test = "testing";';
    render(<CopyButton code={codeSnippet} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Verify it called clipboard API
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(codeSnippet);

    // Move time forward to reset copied state
    act(() => {
      vi.advanceTimersByTime(2000);
    });
  });
});
