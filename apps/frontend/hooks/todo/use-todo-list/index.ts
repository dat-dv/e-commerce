import { useShallow } from 'zustand/react/shallow';

import { useTodoQuery } from '../use-todo-query';
import { useTodoStore } from '../use-todo-store';

export const useTodoList = () => {
  const { page, pageSize } = useTodoQuery();

  const { todos, total, loading } = useTodoStore(
    useShallow((s) => ({
      todos: s.todos,
      total: s.total,
      loading: s.loading,
    })),
  );

  return {
    todos,
    loading,
    totalItems: total,
    pageSize,
    currentPage: page,
  };
};
