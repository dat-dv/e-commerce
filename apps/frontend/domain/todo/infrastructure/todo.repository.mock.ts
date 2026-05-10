import { delay } from '@/utils/delay';

import { ICreateTodoRequest, IGetTodosParams, ITodo, ITodoList } from '../model/todo.model';
import { ITodoRepository } from '../model/todo.repository';

export class MockTodoRepository implements ITodoRepository {
  private todos: ITodo[] = Array.from({ length: 15 }).map((_, i) => ({
    id: (i + 1).toString(),
    title: `Task #${i + 1}`,
    completed: i % 3 === 0,
    createdAt: new Date().toISOString(),
    position: i + 1,
  }));

  async findAll(params?: IGetTodosParams): Promise<ITodoList> {
    await delay(800);

    const filter = params?.filter || 'all';
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;

    let filteredTodos = [...this.todos];
    if (filter === 'active') filteredTodos = filteredTodos.filter((t) => !t.completed);
    if (filter === 'completed') filteredTodos = filteredTodos.filter((t) => t.completed);

    const startIndex = (page - 1) * pageSize;
    const paginatedTodos = filteredTodos.slice(startIndex, startIndex + pageSize);

    const todos = paginatedTodos.map((t) => {
      return {
        id: t.id,
        title: t.title,
        completed: t.completed,
        tempId: t.tempId || t.id,
        createdAt: t.createdAt,
        position: t.position,
      };
    });

    return {
      todos: todos || [],
      total: filteredTodos.length,
      totalCompleted: filteredTodos.filter((t) => t.completed).length,
    };
  }

  async create(req: ICreateTodoRequest): Promise<ITodo> {
    await delay(500);
    const nextId = Math.random().toString();
    const newTodo: ITodo = {
      id: nextId,
      title: req.title,
      completed: false,
      position: this.todos.length + 1,
      createdAt: new Date().toISOString(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  async update(todo: Partial<ITodo>): Promise<ITodo> {
    await delay(500);
    let updatedTodo: ITodo | undefined;
    this.todos = this.todos.map((t) => {
      if (t.id === todo.id) {
        updatedTodo = { ...t, ...todo } as ITodo;
        return updatedTodo;
      }
      return t;
    });

    if (!updatedTodo) {
      throw new Error(`Todo with id ${todo.id} not found.`);
    }

    return updatedTodo;
  }

  async delete(id: string): Promise<void> {
    await delay(500);
    this.todos = this.todos.filter((t) => t.id !== id);
  }
}
