"use client";

import React, { memo } from "react";

import { ETodoFilter } from "@/domain/todo/model/todo.model";
import { useTodoQuery } from "@/hooks/todo/use-todo-query";
import { cn } from "@/utils/cn";

const TodoFilterComponent = () => {
  const { filter: currentFilter, setFilter } = useTodoQuery();

  const FILTERS = [
    { id: ETodoFilter.ALL, label: "All" },
    { id: ETodoFilter.ACTIVE, label: "Active" },
    { id: ETodoFilter.COMPLETED, label: "Completed" },
  ];

  return (
    <div
      data-testid="todo-filter"
      className="flex p-1 bg-white/5 border border-content/10 rounded-2xl gap-1"
    >
      {FILTERS.map((f) => {
        const active = currentFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-300",
              active
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-100"
                : "text-content/50 hover:text-content hover:bg-content/5 hover:scale-105",
            )}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
};

export const TodoFilterMemo = memo(TodoFilterComponent);
