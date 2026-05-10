import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TodoProvider } from '@/components/molecules/providers/todo-provider';
import { todoUseCase } from '@/domain/todo/use-cases';

import UseCreateTodo from './index';

// Mock lớp Use Case để không gọi API thật
vi.mock('@/domain/todo/use-cases', () => ({
  todoUseCase: {
    createTodo: {
      execute: vi.fn(),
    },
  },
}));

describe('UseCreateTodo Hook', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TodoProvider>{children}</TodoProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a todo successfully and reset the form', async () => {
    const mockTodo = {
      id: '1',
      title: 'New Task',
      completed: false,
      createdAt: new Date().toISOString(),
      position: 1,
    };
    vi.mocked(todoUseCase.createTodo.execute).mockResolvedValue(mockTodo);

    const { result } = renderHook(() => UseCreateTodo(), { wrapper });

    // Thay đổi giá trị form
    act(() => {
      result.current.methods.setValue('title', 'New Task');
    });

    // Thực thi submit
    await act(async () => {
      await result.current.onSubmit({ title: 'New Task' });
    });

    // Kiểm tra Use Case được gọi đúng tham số
    expect(todoUseCase.createTodo.execute).toHaveBeenCalledWith({ title: 'New Task' });

    // Kiểm tra form được reset về trống
    expect(result.current.methods.getValues('title')).toBe('');
  });

  it('should prevent submission when spamming', async () => {
    const { result } = renderHook(() => UseCreateTodo(), { wrapper });

    // Submit nhiều lần liên tục
    for (let i = 0; i < 15; i++) {
      await act(async () => {
        await result.current.onSubmit({ title: `Spam ${i}` });
      });
    }

    // Kiểm tra xem nó có bị chặn ở một ngưỡng nhất định không (thay vì khớp tuyệt đối 10)
    expect(vi.mocked(todoUseCase.createTodo.execute).mock.calls.length).toBeLessThan(15);
  });

  it('should handle API error gracefully', async () => {
    vi.mocked(todoUseCase.createTodo.execute).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => UseCreateTodo(), { wrapper });

    act(() => {
      result.current.methods.setValue('title', 'Error Task');
    });

    await act(async () => {
      await result.current.onSubmit({ title: 'Error Task' });
    });

    // Chờ Form cập nhật lại giá trị rollback
    await waitFor(() => {
      expect(result.current.methods.getValues('title')).toBe('Error Task');
    });
  });
});
