import { updateTodoSchema } from "@/hooks/todo/todo.schema";
import { UseCase } from "@/utils/use-case";

import { ITodo } from "../model/todo.model";
import { ITodoRepository } from "../model/todo.repository";

export class UpdateTodoUseCase extends UseCase<Partial<ITodo>, Promise<ITodo>> {
  constructor(private repository: ITodoRepository) {
    super();
  }

  async execute(todo: Partial<ITodo>): Promise<ITodo> {
    updateTodoSchema.parse(todo);
    return this.repository.update(todo);
  }
}
