import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TodoProvider } from '@/components/molecules/providers/todo-provider';

import { useTodoStats } from './index';

describe('useTodoStats Hook', () => {
  it('should return correct statistics from the store', () => {
    // Giả lập Store có 10 task, trong đó 4 task đã hoàn thành
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TodoProvider
        initState={{
          total: 10,
          totalCompleted: 4,
        }}
      >
        {children}
      </TodoProvider>
    );

    const { result } = renderHook(() => useTodoStats(), { wrapper });

    expect(result.current.totalTasks).toBe(10);
    expect(result.current.completedTasks).toBe(4);
  });

  it('should return zero when store is empty', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TodoProvider
        initState={{
          total: 0,
          totalCompleted: 0,
        }}
      >
        {children}
      </TodoProvider>
    );

    const { result } = renderHook(() => useTodoStats(), { wrapper });

    expect(result.current.totalTasks).toBe(0);
    expect(result.current.completedTasks).toBe(0);
  });
});
