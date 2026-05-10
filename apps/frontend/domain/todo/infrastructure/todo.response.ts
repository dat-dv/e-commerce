export interface ITodoResponse {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string | null;
  position: number | null;
}

export interface ITodoListResponse {
  todos: ITodoResponse[];
  total: number;
  totalCompleted: number;
}
