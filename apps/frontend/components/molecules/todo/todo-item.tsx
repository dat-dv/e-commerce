import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';

import { ITodo } from '@/domain/todo/model/todo.model';
import { cn } from '@/utils/cn';

export const TodoItem = ({
  todo,
  isLocked,
  onToggle,
  onDelete,
}: {
  todo: Partial<ITodo>;
  isLocked: boolean;
  onToggle: (tempId: string) => void;
  onDelete: (tempId: string) => void;
}) => {
  const isCompleted = todo?.completed;

  const toggleComplete = () => {
    if (todo.tempId && !isLocked) {
      onToggle(todo.tempId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (todo.tempId && !isLocked) {
      onDelete(todo.tempId);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      onClick={toggleComplete}
      className={cn(
        'group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none',
        isLocked && 'opacity-40 grayscale cursor-not-allowed',
        isCompleted
          ? 'bg-primary/5 border-primary/20 opacity-60'
          : 'bg-white/5 border-content/10 hover:border-primary/30 hover:shadow-lg shadow-primary/5',
      )}
    >
      {isLocked && <div className="absolute inset-0 z-50 cursor-not-allowed pointer-events-auto" />}
      {/* Checkbox */}
      <div
        className={cn(
          'h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0',
          isCompleted
            ? 'bg-primary border-primary text-white scale-100'
            : 'border-content/20 group-hover:border-primary/50 text-transparent',
        )}
      >
        <Check
          className={cn(
            'w-5 h-5 transition-transform duration-300',
            isCompleted ? 'scale-100' : 'scale-0',
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-lg font-bold tracking-tight transition-all duration-300 truncate',
            isCompleted ? 'line-through opacity-40 italic' : 'text-content',
          )}
        >
          {todo.title}
        </p>
      </div>

      {/* Actions */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 h-10 w-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all active:scale-95 z-10"
        disabled={isLocked}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
};
