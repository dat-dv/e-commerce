import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TodoProvider } from '@/components/molecules/providers/todo-provider';
import { ETodoFilter } from '@/domain/todo/model/todo.model';

import { useTodoQuery } from './index';

// Mock hook fetch để tránh side effect lồng nhau quá sâu
vi.mock('../use-todo-fetch', () => ({
  useTodoFetch: () => ({
    fetchTodos: vi.fn(),
  }),
}));

describe('useTodoQuery Hook', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TodoProvider>{children}</TodoProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update URL and store when setFilter is called', async () => {
    const { result } = renderHook(() => useTodoQuery(), { wrapper });
    const mockRouter = useRouter();

    act(() => {
      result.current.setFilter(ETodoFilter.COMPLETED);
    });

    // Kiểm tra router.push có được gọi với đúng query param không
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining('filter=completed'),
      expect.anything()
    );

    // Kiểm tra state trong hook đã cập nhật chưa
    expect(result.current.filter).toBe(ETodoFilter.COMPLETED);
  });

  it('should reset page to 1 when changing filter', async () => {
    const { result } = renderHook(() => useTodoQuery(), { wrapper });
    
    // Giả lập đang ở trang 5
    act(() => {
      result.current.setPage(5);
    });
    expect(result.current.page).toBe(5);

    // Đổi filter sang Active
    act(() => {
      result.current.setFilter(ETodoFilter.ACTIVE);
    });

    // Page phải tự động quay về 1
    expect(result.current.page).toBe(1);
  });

  it('should update URL when setPage is called', async () => {
    const { result } = renderHook(() => useTodoQuery(), { wrapper });
    const mockRouter = useRouter();

    act(() => {
      result.current.setPage(2);
    });

    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining('page=2'),
      expect.anything()
    );
    expect(result.current.page).toBe(2);
  });
});
