'use client';

import { WindowVirtualizer } from 'virtua';

import { ITodo } from '@/domain/todo/model/todo.model';
import { useTodoAction } from '@/hooks/todo/use-todo-action';
import { useTodoStore } from '@/hooks/todo/use-todo-store';
import { useBlock } from '@/hooks/use-block';

import EmptyTodo from './empty-todo';
import { TodoItem } from './todo-item';

const MAX_PENDING_TODO = 44;
const TodoList = ({ items }: { items: Partial<ITodo>[] }) => {
  const { toggleTodo, deleteTodo } = useTodoAction();
  const pendingCount = useTodoStore((s) => s.pendingCount);

  const { isLocked } = useBlock({
    shouldLock: pendingCount > MAX_PENDING_TODO,
    message: 'Too many actions! Please wait a moment.',
  });

  const hasTodo = items.length > 0;

  return (
    <div data-testid="todo-list">
      {hasTodo ? (
        <WindowVirtualizer>
          {items.map((todo) => (
            <div key={todo.tempId} className="px-1 py-2">
              <TodoItem
                todo={todo}
                isLocked={isLocked}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            </div>
          ))}
        </WindowVirtualizer>
      ) : (
        <EmptyTodo />
      )}
    </div>
  );
};

export default TodoList;
