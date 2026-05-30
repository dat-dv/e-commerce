"use client";

import { Avatar, Button, SearchInput } from "@ecommerce/ui";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { AdminUserRepository } from "@/domain/user";
import { type IAdminUser } from "@/domain/user/types/user.model";

export const CustomersView = () => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
            Customer Management
          </h1>
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            View and manage registered system customers, details, and roles.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-xl backdrop-blur-xl">
        <SearchInput
          placeholder="Search customers by name or email..."
          value={searchQuery}
          onSearch={handleSearch}
          showSubmitButton={true}
          className="w-full"
        />
      </div>

      {/* User Table Card */}
      <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-white/1 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-red-400"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-[var(--muted)]"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const fullName =
                    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    "No Name";

                  const roleName = user.role?.roleName || "User";

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-white/1"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-2 ring-white/5">
                            <Avatar
                              name={fullName}
                              url={user.avatarUrl || undefined}
                              size={40}
                            />
                          </div>
                          <div className="font-semibold text-[var(--app-text)]">
                            {fullName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--app-text)]/80">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                          {roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--muted)]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          onClick={() => handleViewDetail(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:bg-indigo-500 hover:text-white"
                          aria-label={`View details of ${fullName}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--border-color)] px-6 py-4">
            <div className="text-xs text-[var(--muted)]">
              Showing page{" "}
              <span className="font-bold text-[var(--app-text)]">{page}</span>{" "}
              of{" "}
              <span className="font-bold text-[var(--app-text)]">
                {totalPages}
              </span>{" "}
              (<span className="font-bold text-[var(--app-text)]">{total}</span>{" "}
              total customers)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-50"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-50"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CustomersView.displayName = "CustomersView";
