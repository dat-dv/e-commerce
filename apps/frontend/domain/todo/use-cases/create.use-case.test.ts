import { describe, expect, it, vi } from "vitest";

import { ITodoRepository } from "../model/todo.repository";
import { CreateTodoUseCase } from "./create.use-case";

describe("CreateTodoUseCase", () => {
  const mockRepo = {
    create: vi.fn(),
  } as unknown as ITodoRepository;

  const useCase = new CreateTodoUseCase(mockRepo);

  it("should throw error if title is empty", async () => {
    await expect(useCase.execute({ title: "" })).rejects.toThrow(
      "Title is required",
    );
  });

  it("should call repository.create with correct title", async () => {
    const mockTodo = {
      id: "1",
      title: "Test Task",
      completed: false,
      createdAt: "2023-01-01T00:00:00Z",
      position: 0,
    };
    vi.mocked(mockRepo.create).mockResolvedValue(mockTodo);

    const result = await useCase.execute({ title: "Test Task" });

    expect(mockRepo.create).toHaveBeenCalledWith({ title: "Test Task" });
    expect(result.title).toBe("Test Task");
  });
});
