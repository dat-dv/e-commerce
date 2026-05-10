import { useTodoQuery } from "@/hooks/todo/use-todo-query";

import { Pagination } from "../pagination";

export const TodoPagination = ({ totalItems }: { totalItems: number }) => {
  const { page: currentPage, pageSize, setPage } = useTodoQuery();

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div data-testid="todo-pagination">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
