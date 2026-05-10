import { appRequest } from "@/utils/request/request";

import { TodoRepository } from "../infrastructure/todo.repository";
import { CreateTodoUseCase } from "./create.use-case";
import { DeleteTodoUseCase } from "./delete.use-case";
import { FindAllTodosUseCase } from "./find-all.use-case";
import { ToggleTodoUseCase } from "./toggle.use-case";
import { UpdateTodoUseCase } from "./update.use-case";

const repo = new TodoRepository(appRequest);

export const todoUseCase = {
  getTodos: new FindAllTodosUseCase(repo),
  createTodo: new CreateTodoUseCase(repo),
  updateTodo: new UpdateTodoUseCase(repo),
  toggleTodo: new ToggleTodoUseCase(repo),
  deleteTodo: new DeleteTodoUseCase(repo),
};
