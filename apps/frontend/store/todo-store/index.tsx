import { StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { PUBLIC_ENV } from '@/config/public.env.config';
import { ETodoFilter } from '@/domain/todo/model/todo.model';

import { TodoStore, TodoStoreState } from './todo-store.types';

export const createTodoStoreCreator =
  (initState?: Partial<TodoStoreState>): StateCreator<TodoStore> =>
  (set, get) => {
    return {
      todos: [],
      total: 0,
      totalCompleted: 0,
      loading: false,
      page: 1,
      pageSize: 10,
      filter: ETodoFilter.ALL,
      pendingCount: 0,
      error: null,
      ...initState,

      // UI Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      incrementPendingCount: () => set((state) => ({ pendingCount: state.pendingCount + 1 })),
      decrementPendingCount: () =>
        set((state) => ({ pendingCount: Math.max(0, state.pendingCount - 1) })),

      // Data Actions
      setTodos: (todos, total, totalCompleted) => set({ todos, total, totalCompleted }),
      appendTodo: (todo) =>
        set((s) => ({
          todos: [todo, ...s.todos].slice(0, s.pageSize),
          total: s.total + 1,
        })),
      updateTodo: (tempId, patch) =>
        set((s) => {
          const itemToUpdate = s.todos.find((t) => t.tempId === tempId);
          let newTotalCompleted = s.totalCompleted;

          if (itemToUpdate && patch.completed !== undefined) {
            if (patch.completed && !itemToUpdate.completed) newTotalCompleted++;
            else if (!patch.completed && itemToUpdate.completed) newTotalCompleted--;
          }

          return {
            todos: s.todos.map((item) => (item.tempId === tempId ? { ...item, ...patch } : item)),
            totalCompleted: newTotalCompleted,
          };
        }),
      deleteTodo: (tempId) =>
        set((s) => {
          const itemToDelete = s.todos.find((t) => t.tempId === tempId);
          const isCompleted = itemToDelete?.completed;

          return {
            todos: s.todos.filter((item) => item.tempId !== tempId),
            total: Math.max(0, s.total - 1),
            totalCompleted: isCompleted ? Math.max(0, s.totalCompleted - 1) : s.totalCompleted,
          };
        }),
      getTodos: () => get().todos,

      // Query Actions
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ pageSize }),
      setFilter: (filter) => set({ filter }),
      hydrate: (state) => set((s) => ({ ...s, ...state })),
    };
  };

export const createTodoStore = (initState?: Partial<TodoStoreState>) =>
  createStore<TodoStore>()(
    devtools(createTodoStoreCreator(initState), {
      name: 'TodoStore',
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
