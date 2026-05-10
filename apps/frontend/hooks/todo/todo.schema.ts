import { z } from "zod";

export const todoTitleSchema = z
  .string()
  .trim()
  .min(1, { message: "Title is required" })
  .max(100, { message: "Title must be less than 100 characters" });

export const createTodoSchema = z.object({
  title: todoTitleSchema,
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = z.object({
  completed: z.boolean().optional(),
  title: todoTitleSchema.optional(),
});

export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
