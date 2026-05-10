import { ICreateTodoRequest, IGetTodosParams, ITodo, ITodoList } from './todo.model';

// ===== IRepository =====
export interface ITodoRepository {
  findAll(params?: IGetTodosParams): Promise<ITodoList>;

  create(req: ICreateTodoRequest): Promise<ITodo>;

  update(todo: Partial<ITodo>): Promise<ITodo>;

  delete(id: string): Promise<void>;
}
