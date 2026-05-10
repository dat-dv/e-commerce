import { UseCase } from '@/utils/use-case';

import { IGetTodosParams, ITodo, ITodoList } from '../model/todo.model';
import { ITodoRepository } from '../model/todo.repository';

export class FindAllTodosUseCase extends UseCase<
  IGetTodosParams | undefined,
  Promise<{ todos: ITodo[]; total: number }>
> {
  constructor(private repository: ITodoRepository) {
    super();
  }

  async execute(params?: IGetTodosParams): Promise<ITodoList> {
    return this.repository.findAll(params);
  }
}
