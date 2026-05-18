"use client";

import { useAdminOrders } from "@/hooks/orders/use-admin-orders";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RotateCw,
  Copy,
  ChevronDown,
  Calendar,
  User,
  ShoppingBag,
  FilterX,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useState } from "react";
import Loading from "@/components/atoms/loading";

export default function AdminOrdersPage() {
  const {
    orders,
    loading,
    search,
    selectedStatuses,
    meta,
    page,
    refresh,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterToggle,
    clearFilters,
    updateOrderStatus,
  } = useAdminOrders({ initialLimit: 10 });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép mã đơn hàng!");
  };

  const handleStatusUpdate = async (orderId: string, newStatus: number) => {
    setActiveDropdown(null);
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
  };

  // Convert raw status to human readable configuration
  const getStatusConfig = (status: number) => {
    return (
      ORDER_STATUS_CONFIG[status] || {
        label: "Unknown",
        color: "text-slate-400 bg-slate-400/10",
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative premium dark gradient mesh backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-sky-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                Hệ Thống Quản Trị Đơn Hàng
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Xem toàn bộ đơn hàng, lọc tìm kiếm nâng cao & cập nhật trạng
                thái trực tiếp.
              </p>
            </div>
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] active:scale-[0.98] transition-all disabled:opacity-50 text-sm font-semibold"
          >
            <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
        </div>

        {/* CONTROLS & FILTER BAR */}
        <div className="border border-white/[0.08] bg-white/[0.01] backdrop-blur-3xl rounded-3xl p-6 space-y-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, email khách hàng, hoặc sản phẩm..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white/[0.08] bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
            />
          </div>

          {/* Status filter list */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Lọc Theo Trạng Thái Đơn Hàng
              </span>
              {(selectedStatuses.length > 0 || search) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  Xóa tất cả bộ lọc
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => {
                const statusNum = Number(key);
                const isSelected = selectedStatuses.includes(statusNum);
                return (
                  <button
                    key={key}
                    onClick={() => handleStatusFilterToggle(statusNum)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-violet-500/20 border-violet-500 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                        : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-6">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-white/[0.08] bg-white/[0.01] rounded-3xl">
              <Loading />
              <span className="text-sm text-slate-400 mt-4 font-medium">
                Đang tải dữ liệu đơn hàng...
              </span>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-white/[0.08] bg-white/[0.01] rounded-3xl px-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-slate-500 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Không tìm thấy đơn hàng nào
              </h3>
              <p className="text-slate-400 text-sm max-w-sm mb-6">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem các kết quả
                khác.
              </p>
              {(selectedStatuses.length > 0 || search) && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-sm font-semibold transition-all"
                >
                  Xóa bộ lọc để quay lại
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <AnimatePresence mode="popLayout">
                {orders.map((order) => {
                  const statusConf = getStatusConfig(order.status);
                  const isUpdating = updatingId === order.id;

                  return (
                    <motion.div
                      layout
                      key={order.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`relative overflow-visible border rounded-3xl bg-slate-950/40 backdrop-blur-2xl p-6 transition-all duration-300 ${
                        isUpdating
                          ? "border-violet-500/40 bg-violet-500/[0.02] shadow-[0_0_30px_rgba(139,92,246,0.05)]"
                          : "border-white/[0.08] hover:border-white/[0.15]"
                      }`}
                    >
                      {/* Order Core Card Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.06] pb-4 mb-5">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                              MÃ ĐƠN HÀNG
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-mono font-bold text-white">
                                {order.id}
                              </span>
                              <button
                                onClick={() => copyToClipboard(order.id)}
                                className="p-1 rounded-md bg-white/[0.04] border border-white/[0.04] text-slate-400 hover:text-white transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              {new Date(order.createdAt).toLocaleString(
                                "vi-VN",
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              Khách hàng: {order.userId}
                            </span>
                          </div>
                        </div>

                        {/* Order status indicator */}
                        <div className="flex items-center gap-2 self-start lg:self-auto">
                          <div
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${statusConf.color}`}
                          >
                            {statusConf.label}
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-4 mb-6">
                        {order.items.map((item) => {
                          const snap = item.snapshot;
                          const name = snap?.sku?.product?.name || "Sản phẩm";
                          const image =
                            snap?.sku?.image_url || "/images/placeholder.png";
                          const attributes = snap?.sku?.attributes
                            ? JSON.parse(snap.sku.attributes)
                            : null;
                          const formattedAttrs = attributes
                            ? Object.entries(attributes)
                                .map(([key, val]) => `${key}: ${val}`)
                                .join(" | ")
                            : null;

                          return (
                            <div
                              key={item.id}
                              className="flex gap-4 items-center border-b border-white/[0.04] pb-4 last:border-0 last:pb-0"
                            >
                              <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] shrink-0">
                                <Image
                                  src={image}
                                  alt={name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {name}
                                </h4>
                                {formattedAttrs && (
                                  <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                                    {formattedAttrs}
                                  </p>
                                )}
                                <div className="text-xs text-slate-500 mt-0.5">
                                  Số lượng:{" "}
                                  <span className="text-slate-300 font-semibold">
                                    {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-sm font-bold text-white">
                                  {item.price.toLocaleString("vi-VN")}₫
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            Tổng thanh toán:
                          </span>
                          <span className="text-lg font-black text-violet-400">
                            {order.totalAmount.toLocaleString("vi-VN")}₫
                          </span>
                        </div>

                        {/* Interactive Dropdown to Update Status */}
                        <div className="relative self-end sm:self-auto overflow-visible">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === order.id ? null : order.id,
                              )
                            }
                            disabled={isUpdating}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/[0.08] text-xs font-bold text-slate-200 transition-all"
                          >
                            Cập nhật trạng thái
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          {activeDropdown === order.id && (
                            <>
                              {/* Overlay click catcher */}
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveDropdown(null)}
                              />
                              <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mt-2 w-52 rounded-2xl bg-slate-900 border border-white/[0.1] shadow-2xl p-2 z-50 overflow-hidden">
                                <div className="px-3 py-2 border-b border-white/[0.05]">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                                    CHỌN TRẠNG THÁI MỚI
                                  </span>
                                </div>
                                <div className="py-1 max-h-60 overflow-y-auto">
                                  {Object.entries(ORDER_STATUS_CONFIG).map(
                                    ([key, config]) => {
                                      const statusVal = Number(key);
                                      const isCurrent =
                                        order.status === statusVal;

                                      return (
                                        <button
                                          key={key}
                                          onClick={() =>
                                            handleStatusUpdate(
                                              order.id,
                                              statusVal,
                                            )
                                          }
                                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors ${
                                            isCurrent
                                              ? "bg-violet-500/10 text-violet-400"
                                              : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                                          }`}
                                        >
                                          <span>{config.label}</span>
                                          {isCurrent && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                          )}
                                        </button>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
            <span className="text-xs text-slate-400 font-medium">
              Trang <span className="text-white font-bold">{page}</span> /{" "}
              {meta.totalPages} ({meta.total} đơn hàng)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => handlePageChange(page - 1)}
                className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (p) => {
                    const isCurrent = page === p;
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        disabled={loading}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/15"
                            : "border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  },
                )}
              </div>

              <button
                disabled={page >= meta.totalPages || loading}
                onClick={() => handlePageChange(page + 1)}
                className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
