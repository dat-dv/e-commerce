import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AvatarInput from './index';

vi.mock('@/components/molecules/img-cropper', () => ({
  default: () => <div data-testid="img-cropper">Mock Cropper</div>,
}));

describe('AvatarInput Component', () => {
  it('should render avatar correctly', () => {
    render(<AvatarInput onChange={vi.fn()} displayName="Jane Doe" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should render the change button when not disabled', () => {
    const { container } = render(<AvatarInput onChange={vi.fn()} />);
    const button = screen.getByRole('button', { name: /change avatar/i });
    expect(button).toBeInTheDocument();

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('should hide the change button when disabled', () => {
    const { container } = render(<AvatarInput onChange={vi.fn()} disabled />);
    const button = screen.queryByRole('button', { name: /change avatar/i });
    expect(button).not.toBeInTheDocument();

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).not.toBeInTheDocument();
  });
});
