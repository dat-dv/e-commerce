import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

import { ETodoFilter, ITodo } from '../model/todo.model';
import { ITodoRepository } from '../model/todo.repository';
import { CreateTodoUseCase } from './create.use-case';
import { DeleteTodoUseCase } from './delete.use-case';
import { FindAllTodosUseCase } from './find-all.use-case';
import { ToggleTodoUseCase } from './toggle.use-case';
import { UpdateTodoUseCase } from './update.use-case';

describe('Todo Use Cases', () => {
  let mockRepo: ITodoRepository;

  const mockTodo: ITodo = {
    id: '1',
    title: 'Original Task',
    completed: false,
    createdAt: '2023-01-01T00:00:00Z',
    position: 0,
  };

  beforeEach(() => {
    mockRepo = {
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
  });

  describe('FindAllTodosUseCase', () => {
    it('should fetch todos from repository', async () => {
      const useCase = new FindAllTodosUseCase(mockRepo);
      vi.mocked(mockRepo.findAll).mockResolvedValue({
        todos: [mockTodo],
        total: 1,
        totalCompleted: 1,
      });

      const result = await useCase.execute({ filter: ETodoFilter.ALL });

      expect(result).toEqual({ todos: [mockTodo], total: 1, totalCompleted: 1 });
      expect(mockRepo.findAll).toHaveBeenCalledWith({ filter: 'all' });
    });
  });

  describe('CreateTodoUseCase', () => {
    it('should create a todo successfully with valid data', async () => {
      const useCase = new CreateTodoUseCase(mockRepo);
      const request = { title: 'New Task' };
      vi.mocked(mockRepo.create).mockResolvedValue(mockTodo);

      const result = await useCase.execute(request);

      expect(result).toEqual(mockTodo);
      expect(mockRepo.create).toHaveBeenCalledWith({ title: 'New Task' });
    });

    it('should throw ZodError if title is empty', async () => {
      const useCase = new CreateTodoUseCase(mockRepo);
      try {
        await useCase.execute({ title: '' });
      } catch (err) {
        expect(err).toBeInstanceOf(ZodError);
        const zodError = err as ZodError;
        expect(zodError.issues[0].message).toBe('Title is required');
      }
    });

    it('should throw manual error for forbidden keywords', async () => {
      const useCase = new CreateTodoUseCase(mockRepo);
      const dangerousTitle = '<script>alert("hack")</script>';
      await expect(useCase.execute({ title: dangerousTitle })).rejects.toThrow(
        'Title contains forbidden keywords',
      );
    });
  });

  describe('UpdateTodoUseCase', () => {
    it('should validate title during update using Zod', async () => {
      const useCase = new UpdateTodoUseCase(mockRepo);
      try {
        await useCase.execute({ id: '1', title: '' });
      } catch (err) {
        expect(err).toBeInstanceOf(ZodError);
        const zodError = err as ZodError;
        expect(zodError.issues[0].message).toBe('Title is required');
      }
    });

    it('should update successfully with partial data', async () => {
      const useCase = new UpdateTodoUseCase(mockRepo);
      const patch = { id: '1', completed: true };
      vi.mocked(mockRepo.update).mockResolvedValue({ ...mockTodo, ...patch });

      const result = await useCase.execute(patch);
      expect(result.completed).toBe(true);
      expect(mockRepo.update).toHaveBeenCalledWith(patch);
    });
  });

  describe('ToggleTodoUseCase', () => {
    it('should flip the completed status', async () => {
      const useCase = new ToggleTodoUseCase(mockRepo);
      const todo = { id: '1', completed: false };
      vi.mocked(mockRepo.update).mockResolvedValue({ ...mockTodo, completed: true });

      const result = await useCase.execute(todo);
      expect(result.completed).toBe(true);
      expect(mockRepo.update).toHaveBeenCalledWith({ id: '1', completed: true });
    });
  });

  describe('DeleteTodoUseCase', () => {
    it('should call delete on repository', async () => {
      const useCase = new DeleteTodoUseCase(mockRepo);
      await useCase.execute('123');
      expect(mockRepo.delete).toHaveBeenCalledWith('123');
    });

    it('should throw manual error if id is missing', async () => {
      const useCase = new DeleteTodoUseCase(mockRepo);
      await expect(useCase.execute('')).rejects.toThrow('ID is required for deletion');
    });
  });
});
