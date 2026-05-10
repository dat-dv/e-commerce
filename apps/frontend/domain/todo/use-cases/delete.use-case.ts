import { UseCase } from '@/utils/use-case';

import { ITodoRepository } from '../model/todo.repository';

export class DeleteTodoUseCase extends UseCase<string, Promise<void>> {
  constructor(private repository: ITodoRepository) {
    super();
  }

  async execute(id: string): Promise<void> {
    if (!id) throw new Error('ID is required for deletion');
    return this.repository.delete(id);
  }
}
