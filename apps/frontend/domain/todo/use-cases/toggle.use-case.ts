import { UseCase } from "@/utils/use-case";

import { ITodo } from "../model/todo.model";
import { ITodoRepository } from "../model/todo.repository";

export class ToggleTodoUseCase extends UseCase<Partial<ITodo>, Promise<ITodo>> {
  constructor(private repository: ITodoRepository) {
    super();
  }

  async execute(todo: Partial<ITodo>): Promise<ITodo> {
    if (!todo.id) throw new Error("ID is required for toggle");
    return this.repository.update({ id: todo.id, completed: !todo.completed });
  }
}
