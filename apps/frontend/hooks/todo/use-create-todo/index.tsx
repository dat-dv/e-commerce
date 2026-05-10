import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useSpamCounter } from "@/hooks/use-spam-counter";

import { CreateTodoSchema, createTodoSchema } from "../todo.schema";
import { useTodoAction } from "../use-todo-action";

const THROTTLE_TIME = 1000;
const MAX_SPAM_COUNT = 10;

const UseCreateTodo = () => {
  const { addTodo } = useTodoAction();
  const { count, isSpam, increment } = useSpamCounter({
    maxCount: MAX_SPAM_COUNT,
    interval: THROTTLE_TIME,
  });
  const methods = useForm<CreateTodoSchema>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    async (data: CreateTodoSchema) => {
      if (isSpam) return;
      methods.setValue("title", "");

      increment();

      if (count >= MAX_SPAM_COUNT) {
        toast.warning("Adding too fast! Local cooldown active.", {
          toastId: "input-spam",
        });
        return;
      }

      try {
        await addTodo(data.title.trim());
        methods.reset();
      } catch {
        methods.setValue("title", data?.title || "");
        // useTodoAction handles primary error notifications
      }
    },
    [addTodo, count, increment, isSpam, methods],
  );

  return {
    onSubmit,
    methods,
  };
};

export default UseCreateTodo;
