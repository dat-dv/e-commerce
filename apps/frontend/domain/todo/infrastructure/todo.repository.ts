import { APP_ROUTES } from "@/constants/routes";
import { TRequest } from "@/utils/request/request.types";

import {
  ICreateTodoRequest,
  IGetTodosParams,
  ITodo,
  ITodoList,
} from "../model/todo.model";
import { ITodoRepository } from "../model/todo.repository";
import { TodoMapper } from "./todo.mapper";
import { ITodoResponse } from "./todo.response";

export class TodoRepository implements ITodoRepository {
  constructor(private request: TRequest) {}

  async findAll(params?: IGetTodosParams): Promise<ITodoList> {
    const searchParams = new URLSearchParams();
    if (params?.filter) searchParams.append("filter", params.filter);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const endpoint = `${API_ROUTES.TODO.LIST}${query}`;

    const { todos, total, totalCompleted } = await this.request.get<{
      todos: ITodoResponse[];
      total: number;
      totalCompleted: number;
    }>(endpoint);
    return {
      todos: todos?.map(TodoMapper.toDomain) || [],
      total: total || 0,
      totalCompleted: totalCompleted || 0,
    };
  }

  async create(req: ICreateTodoRequest): Promise<ITodo> {
    const data = await this.request.post<ITodoResponse>(
      API_ROUTES.TODO.CREATE,
      req,
    );
    return TodoMapper.toDomain(data);
  }

  async update(todo: Partial<ITodo>): Promise<ITodo> {
    const dto = TodoMapper.toServer(todo);
    const data = await this.request.put<ITodoResponse>(
      API_ROUTES.TODO.UPDATE(todo.id!),
      dto,
    );
    return TodoMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.request.delete(API_ROUTES.TODO.DELETE(id));
  }
}
