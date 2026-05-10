"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { ETodoFilter } from "@/domain/todo/model/todo.model";
import { todoUseCase } from "@/domain/todo/use-cases";

import { useTodoStore } from "../use-todo-store";

export const useTodoFetch = () => {
  const { setTodos, setLoading, setError } = useTodoStore(
    useShallow((s) => ({
      setTodos: s.setTodos,
      setLoading: s.setLoading,
      setError: s.setError,
    })),
  );

  const fetchTodos = useCallback(
    async (filter?: ETodoFilter, page?: number, pageSize?: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await todoUseCase.getTodos.execute({
          filter,
          page,
          pageSize,
        });
        setTodos(data.todos, data.total, data.totalCompleted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fetch failed");
      } finally {
        setLoading(false);
      }
    },
    [setTodos, setLoading, setError],
  );

  return { fetchTodos };
};
