import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TodoProvider } from '@/components/molecules/providers/todo-provider';

import { useTodoList } from './index';

describe('useTodoList Hook', () => {
  it('should return todos and pagination info from the store', () => {
    const mockTodos = [
      {
        id: '1',
        title: 'Task 1',
        completed: false,
        createdAt: new Date().toISOString(),
        position: 1,
      },
      {
        id: '2',
        title: 'Task 2',
        completed: true,
        createdAt: new Date().toISOString(),
        position: 2,
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TodoProvider
        initState={{
          todos: mockTodos,
          total: 2,
          page: 1,
          pageSize: 10,
        }}
      >
        {children}
      </TodoProvider>
    );

    const { result } = renderHook(() => useTodoList(), { wrapper });

    expect(result.current.todos).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });
});
