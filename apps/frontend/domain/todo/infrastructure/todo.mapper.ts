import { ITodo } from '../model/todo.model';
import { ITodoResponse } from './todo.response';

export const TodoMapper = {
  toDomain(dto: ITodoResponse): ITodo {
    return {
      id: dto.id,
      tempId: dto.id,
      title: dto.title,
      completed: dto.completed,
      createdAt: dto.created_at || new Date().toISOString(),
      position: dto.position ?? 0,
    };
  },

  toServer(todo: Partial<ITodo>): Partial<ITodoResponse> {
    const dto: Partial<ITodoResponse> = {};
    if (todo.id !== undefined) dto.id = todo.id;
    if (todo.title !== undefined) dto.title = todo.title;
    if (todo.completed !== undefined) dto.completed = todo.completed;
    if (todo.createdAt !== undefined) dto.created_at = todo.createdAt;
    if (todo.position !== undefined) dto.position = todo.position;
    return dto;
  },
};
