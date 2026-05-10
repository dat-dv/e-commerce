import { createTodoSchema } from "@/hooks/todo/todo.schema";
import { UseCase } from "@/utils/use-case";

import { ICreateTodoRequest, ITodo } from "../model/todo.model";
import { ITodoRepository } from "../model/todo.repository";

export class CreateTodoUseCase extends UseCase<
  ICreateTodoRequest,
  Promise<ITodo>
> {
  constructor(private repository: ITodoRepository) {
    super();
  }

  async execute(req: ICreateTodoRequest): Promise<ITodo> {
    const validated = createTodoSchema.parse(req);

    if (/<script\b[^>]*>([\s\S]*?)<\/script>/gm.test(validated.title)) {
      throw new Error("Title contains forbidden keywords");
    }

    return this.repository.create({ ...req, title: validated.title.trim() });
  }
}
