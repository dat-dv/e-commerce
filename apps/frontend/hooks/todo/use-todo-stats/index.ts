'use client';

import { useTodoStore } from '../use-todo-store';

/**
 * Hook to calculate todo statistics from the store.
 * Optimized with atomic selectors to avoid re-renders on unrelated store changes.
 */
export const useTodoStats = () => {
  const totalTasks = useTodoStore((s) => s.total);
  const completedTasks = useTodoStore((s) => s.totalCompleted);

  return {
    totalTasks,
    completedTasks,
  };
};
