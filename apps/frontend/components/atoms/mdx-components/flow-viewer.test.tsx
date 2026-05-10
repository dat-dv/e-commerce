import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FlowViewer } from './flow-viewer';

describe('FlowViewer Component', () => {
  it('should render with title', () => {
    render(<FlowViewer initialNodes={[]} initialEdges={[]} title="System Architecture" />);
    expect(screen.getByText('System Architecture')).toBeInTheDocument();
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });
});
