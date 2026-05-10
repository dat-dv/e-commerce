import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MermaidViewer } from './mermaid-viewer';

describe('MermaidViewer Component', () => {
  it('should render the deprecation warning', () => {
    render(<MermaidViewer />);
    expect(screen.getByText(/Mermaid is Deprecated/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Static Mermaid diagrams are no longer supported/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/FlowViewer/i)).toBeInTheDocument();
  });
});
