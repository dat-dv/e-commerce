import { ListTodo } from "lucide-react";

import { useTodoStats } from "@/hooks/todo/use-todo-stats";

const TodoStats = () => {
  const { totalTasks, completedTasks } = useTodoStats();
  return (
    <div data-testid="todo-stats" className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shadow-primary/10">
        <ListTodo className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-3xl font-black text-content tracking-tight">
          Active Tasks
        </h2>
        <p className="text-sm font-bold opacity-60 flex gap-2">
          <span className="text-primary">
            {completedTasks}/{totalTasks}
          </span>{" "}
          Completed
        </p>
      </div>
    </div>
  );
};

export default TodoStats;
