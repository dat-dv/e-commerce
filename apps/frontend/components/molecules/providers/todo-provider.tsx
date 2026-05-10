"use client";

import { createContext, ReactNode, useState } from "react";

import { createTodoStore } from "@/store/todo-store";
import { TodoStoreState } from "@/store/todo-store/todo-store.types";

export type TodoStore = ReturnType<typeof createTodoStore>;
export const TodoContext = createContext<TodoStore | null>(null);

export interface TodoProviderProps {
  children: ReactNode;
  initState?: Partial<TodoStoreState>;
}

export const TodoProvider = ({ children, initState }: TodoProviderProps) => {
  const [store] = useState(() => createTodoStore(initState));

  return <TodoContext.Provider value={store}>{children}</TodoContext.Provider>;
};
