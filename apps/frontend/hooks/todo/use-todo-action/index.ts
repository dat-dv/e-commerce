"use client";

import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";

import { ETodoFilter, ITodo } from "@/domain/todo/model/todo.model";
import { todoUseCase } from "@/domain/todo/use-cases";
import { createTodoSchema } from "@/hooks/todo/todo.schema";

import { useTodoQuery } from "../use-todo-query";
import { useTodoStore } from "../use-todo-store";

export const useTodoAction = () => {
  const { filter, page, pageSize, setFilter, setPage, setPageSize } =
    useTodoQuery();

  const {
    setTodos,
    appendTodo,
    updateTodo,
    removeTodo,
    incrementPendingCount,
    decrementPendingCount,
    getTodos,
  } = useTodoStore(
    useShallow((s) => ({
      getTodos: s.getTodos,
      setTodos: s.setTodos,
      appendTodo: s.appendTodo,
      updateTodo: s.updateTodo,
      removeTodo: s.deleteTodo,
      incrementPendingCount: s.incrementPendingCount,
      decrementPendingCount: s.decrementPendingCount,
    })),
  );

  const addTodo = useCallback(
    async (title: string) => {
      const validated = createTodoSchema.safeParse({ title });
      if (!validated.success) return;

      const tempId = String(Date.now() + Math.random());
      const tempTodo: Partial<ITodo> = {
        tempId,
        title: title.trim(),
        completed: false,
        position: Date.now(),
        createdAt: new Date().toISOString(),
      };

      appendTodo(tempTodo);
      incrementPendingCount();
      setPage(1);

      try {
        const data = await todoUseCase.createTodo.execute({ title });
        updateTodo(tempId, { ...data, tempId });
      } catch (err) {
        removeTodo(tempId);
        toast.error(err instanceof Error ? err.message : "Add failed");
        throw err; // Ném lỗi để UseCreateTodo biết mà rollback title
      } finally {
        decrementPendingCount();
      }
    },
    [
      appendTodo,
      updateTodo,
      removeTodo,
      incrementPendingCount,
      decrementPendingCount,
      setPage,
    ],
  );

  const toggleTodo = useCallback(
    async (tempId: string) => {
      const todos = getTodos();
      const todo = todos.find((t) => t.tempId === tempId);
      if (!todo) return;

      const updatedTodo: Partial<ITodo> = {
        ...todo,
        completed: !todo.completed,
      };

      updateTodo(tempId, updatedTodo);
      incrementPendingCount();

      if (!todo.id) {
        decrementPendingCount();
        return;
      }

      try {
        const data = await todoUseCase.toggleTodo.execute(todo as ITodo);
        updateTodo(tempId, { ...data, tempId });
      } catch {
        updateTodo(tempId, todo);
        toast.error("Toggle failed");
      } finally {
        decrementPendingCount();
      }
    },
    [getTodos, updateTodo, incrementPendingCount, decrementPendingCount],
  );

  const deleteTodo = useCallback(
    async (tempId: string) => {
      const todos = getTodos();
      const originalTodo = todos.find((t) => t.tempId === tempId);
      if (!originalTodo) return;

      removeTodo(tempId);
      incrementPendingCount();

      // If we're deleting the last item on a page > 1, go back one page
      if (todos.length === 1 && page > 1) {
        setPage(page - 1);
      }

      if (!originalTodo.id) {
        decrementPendingCount();
        return;
      }

      try {
        await todoUseCase.deleteTodo.execute(originalTodo.id);
      } catch {
        const data = await todoUseCase.getTodos.execute({
          filter,
          page,
          pageSize,
        });
        setTodos(data.todos, data.total, data.totalCompleted);
        toast.error("Delete failed");
      } finally {
        decrementPendingCount();
      }
    },
    [
      getTodos,
      removeTodo,
      setTodos,
      incrementPendingCount,
      decrementPendingCount,
      page,
      setPage,
      filter,
      pageSize,
    ],
  );

  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage],
  );

  const handleChangePageSize = useCallback(
    (pageSize: number) => {
      setPageSize(pageSize);
    },
    [setPageSize],
  );

  const handleChangeFilter = useCallback(
    (filter: ETodoFilter) => {
      setFilter(filter);
    },
    [setFilter],
  );

  return useMemo(
    () => ({
      addTodo,
      toggleTodo,
      deleteTodo,
      handleChangePage,
      handleChangePageSize,
      handleChangeFilter,
    }),
    [
      addTodo,
      toggleTodo,
      deleteTodo,
      handleChangePage,
      handleChangePageSize,
      handleChangeFilter,
    ],
  );
};
