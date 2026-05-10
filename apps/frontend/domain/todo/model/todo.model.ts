// ===== Cliet Model =====
export interface ITodo {
  id: string;
  tempId?: string;
  title: string;
  completed: boolean;
  createdAt: string;
  position: number | null;
}
export interface ITodoList {
  todos: ITodo[];
  total: number;
  totalCompleted: number;
}

export enum ETodoFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface IGetTodosParams {
  filter?: ETodoFilter;
  page?: number;
  pageSize?: number;
}

// ===== Client Request =====
export interface ICreateTodoRequest {
  title: string;
}
