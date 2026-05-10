import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmptyTodo from './empty-todo';

describe('EmptyTodo Component', () => {
  it('should render the empty state message', () => {
    render(<EmptyTodo />);

    expect(screen.getByText('✨')).toBeInTheDocument();
    expect(screen.getByText('No tasks found in this view')).toBeInTheDocument();
  });
});
