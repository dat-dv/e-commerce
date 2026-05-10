import { useContext } from "react";
import { useStore } from "zustand";

import { TodoContext } from "@/components/molecules/providers/todo-provider";
import { TodoStore } from "@/store/todo-store/todo-store.types";

export const useTodoStore = <T>(selector: (state: TodoStore) => T): T => {
  const store = useContext(TodoContext);
  if (!store) {
    throw new Error("Missing TodoProvider");
  }

  return useStore(store, selector);
};
