import { ETodoFilter, ITodo } from '@/domain/todo/model/todo.model';

export interface TodoStore extends TodoStoreState, TodoStoreHandler {}

export interface TodoStoreState {
  todos: Partial<ITodo>[];
  total: number;
  totalCompleted: number;
  page: number;
  pageSize: number;
  filter: ETodoFilter;
  loading: boolean;
  pendingCount: number;
  error: string | null;
}

export interface TodoStoreHandler {
  // UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  incrementPendingCount: () => void;
  decrementPendingCount: () => void;

  // Data Actions
  setTodos: (todos: Partial<ITodo>[], total: number, totalCompleted: number) => void;
  appendTodo: (todo: Partial<ITodo>) => void;
  updateTodo: (tempId: string, patch: Partial<ITodo>) => void;
  deleteTodo: (tempId: string) => void;
  getTodos: () => Partial<ITodo>[];

  // Query Actions
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setFilter: (filter: ETodoFilter) => void;

  hydrate: (state: Partial<TodoStoreState>) => void;
}
