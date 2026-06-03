"use client";

import { toast } from "@ecommerce/ui";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { adminUserUseCase } from "@/domain/user";
import type { IAdminUser } from "@/domain/user/types/user.model";
import usePagination from "@/hooks/use-pagination";

import { type ICustomerFilterPaginationParams } from "./use-customer-filters";

export type ICustomersViewPaginationParams = ICustomerFilterPaginationParams;

export const useCustomersView = () => {
  const router = useRouter();

  const { data, loading, getFirstPage, onChangePagination, onChangeFilter } =
    usePagination<IAdminUser, ICustomersViewPaginationParams>({
      initialData: null,
      isSyncWithSearchParams: false,
      fetchPage: async (params) => {
        try {
          const response = await adminUserUseCase.getUsers.execute({
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            search: params.search,
            roleId: params.roleId as string | undefined,
            gender: params.gender as string | undefined,
            sortBy: params.sortBy as string | undefined,
          });
          return {
            data: {
              items: response.items,
              meta: response.meta,
            },
          };
        } catch {
          const message = "Failed to fetch customer data. Please try again.";
          toast.error(message);
          throw new Error(message);
        }
      },
    });

  const handleViewDetail = (user: IAdminUser) => {
    router.push(APP_ROUTES.CUSTOMER_DETAIL(user.id));
  };

  return {
    users: data.items,
    loading,
    page: data.meta.page,
    limit: data.meta.limit,
    total: data.meta.total,
    totalPages: data.meta.totalPages,
    setPage: onChangePagination,
    setPageSize: (limit: number) => getFirstPage({ page: 1, limit }),
    onChangeFilter,
    handleViewDetail,
  };
};
