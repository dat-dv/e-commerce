"use client";

import { Plus } from "lucide-react";
import { memo } from "react";
import { useFormState } from "react-hook-form";

import Button from "@/components/atoms/button";
import UseCreateTodo from "@/hooks/todo/use-create-todo";

import AppForm from "../form/app-form";
import { FormInput } from "../form/form-input";

export const TodoInput = memo(() => {
  const { methods, onSubmit } = UseCreateTodo();

  return (
    <AppForm
      data-testid="todo-input"
      className="flex gap-2"
      methods={methods}
      onSubmit={onSubmit}
    >
      <FormInput
        name="title"
        placeholder="Add a new task..."
        className="flex-1"
        maxCount={100}
      />
      <ButtonSubmitNewTodo />
    </AppForm>
  );
});

TodoInput.displayName = "TodoInput";

const ButtonSubmitNewTodo = memo(() => {
  const { isValid, isSubmitting } = useFormState();
  const isDisabled = !isValid || isSubmitting;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className="h-12 w-12 rounded-2xl flex items-center justify-center p-0 shrink-0 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:grayscale disabled:opacity-50"
    >
      <Plus className="size-3.5 stroke-[3.5px] shrink-0" />
    </Button>
  );
});

ButtonSubmitNewTodo.displayName = "ButtonSubmitNewTodo";
