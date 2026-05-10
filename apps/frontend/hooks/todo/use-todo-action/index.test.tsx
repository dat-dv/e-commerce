import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TodoProvider } from "@/components/molecules/providers/todo-provider";
import { todoUseCase } from "@/domain/todo/use-cases";

import { useTodoAction } from "./index";

// Mock Use Case layer
vi.mock("@/domain/todo/use-cases", () => ({
  todoUseCase: {
    createTodo: { execute: vi.fn() },
    toggleTodo: { execute: vi.fn() },
    deleteTodo: { execute: vi.fn() },
    getTodos: { execute: vi.fn() },
  },
}));

describe("useTodoAction Hook", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TodoProvider>{children}</TodoProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add a todo and update the store", async () => {
    const mockTodo = {
      id: "1",
      title: "Action Task",
      completed: false,
      createdAt: "",
      position: 1,
    };
    vi.mocked(todoUseCase.createTodo.execute).mockResolvedValue(mockTodo);

    const { result } = renderHook(() => useTodoAction(), { wrapper });

    await act(async () => {
      await result.current.addTodo("Action Task");
    });

    expect(todoUseCase.createTodo.execute).toHaveBeenCalledWith({
      title: "Action Task",
    });
  });

  it("should toggle a todo correctly", async () => {
    const initialTodo = {
      tempId: "temp-1",
      id: "1",
      title: "Task",
      completed: false,
      createdAt: "",
      position: 1,
    };

    const wrapperWithData = ({ children }: { children: React.ReactNode }) => (
      <TodoProvider initState={{ todos: [initialTodo] }}>
        {children}
      </TodoProvider>
    );

    vi.mocked(todoUseCase.toggleTodo.execute).mockResolvedValue({
      ...initialTodo,
      completed: true,
    });

    const { result } = renderHook(() => useTodoAction(), {
      wrapper: wrapperWithData,
    });

    await act(async () => {
      await result.current.toggleTodo("temp-1");
    });

    expect(todoUseCase.toggleTodo.execute).toHaveBeenCalled();
  });

  it("should delete a todo correctly", async () => {
    const initialTodo = {
      tempId: "temp-1",
      id: "1",
      title: "Task",
      completed: false,
      createdAt: "",
      position: 1,
    };

    const wrapperWithData = ({ children }: { children: React.ReactNode }) => (
      <TodoProvider initState={{ todos: [initialTodo], total: 1 }}>
        {children}
      </TodoProvider>
    );

    const { result } = renderHook(() => useTodoAction(), {
      wrapper: wrapperWithData,
    });

    await act(async () => {
      await result.current.deleteTodo("temp-1");
    });

    expect(todoUseCase.deleteTodo.execute).toHaveBeenCalledWith("1");
  });
});
