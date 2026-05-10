"use client";

import TodoList from "@/components/molecules/todo/todo-list";
import { TodoSkeleton } from "@/components/molecules/todo/todo-skeleton";
import TodoStats from "@/components/molecules/todo/todo-stats";
import { useTodoList } from "@/hooks/todo/use-todo-list";

import { TodoFilterMemo } from "../../molecules/todo/todo-filter";
import { TodoInput } from "../../molecules/todo/todo-input";
import { TodoPagination } from "../../molecules/todo/todo-pagination";

export const TodoView = () => {
  const { todos, loading, totalItems } = useTodoList();

  return (
    <div className="w-full pb-20 space-y-12 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <TodoStats />
        <TodoFilterMemo />
      </div>

      <div className="px-4">
        <TodoInput />
      </div>

      <div className="flex-1 space-y-3 px-4 min-h-[400px]">
        {loading ? (
          <TodoSkeleton />
        ) : (
          <>
            <TodoList items={todos} />
            <TodoPagination totalItems={totalItems} />
          </>
        )}
      </div>
    </div>
  );
};
