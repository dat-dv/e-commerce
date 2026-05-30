"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { AdminUserRepository } from "@/domain/user";
import type { IAdminUser } from "@/domain/user/types/user.model";

export const useCustomersView = () => {
  const router = useRouter();
  const userRepository = useMemo(() => new AdminUserRepository(), []);

  // State Management
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch Users
  const fetchUsers = async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userRepository.getUsers(currentPage, limit);
      setUsers(response.items);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to fetch customer data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    fetchUsers(1);
  };

  const handleViewDetail = (user: IAdminUser) => {
    router.push(APP_ROUTES.CUSTOMER_DETAIL(user.id));
  };

  // Client-side filtering as a fallback and extra responsiveness
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(lowerQuery) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(lowerQuery),
    );
  }, [users, searchQuery]);

  return {
    users,
    loading,
    error,
    searchQuery,
    page,
    limit,
    total,
    totalPages,
    filteredUsers,
    setPage,
    handleSearch,
    handleViewDetail,
  };
};
