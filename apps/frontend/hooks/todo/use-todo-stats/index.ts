"use client";

import { useTodoStore } from "../use-todo-store";

export const useTodoStats = () => {
  const totalTasks = useTodoStore((s) => s.total);
  const completedTasks = useTodoStore((s) => s.totalCompleted);

  return {
    totalTasks,
    completedTasks,
  };
};
