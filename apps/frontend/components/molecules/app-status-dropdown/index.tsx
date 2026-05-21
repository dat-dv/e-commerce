"use client";

import React, { useCallback, useState } from "react";
import {
  MenuTrigger as RACMenuTrigger,
  Button as RACButton,
  Popover as RACPopover,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
} from "react-aria-components";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { EOrderStatus } from "@ecommerce/shared";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { cn } from "@/utils/cn";

export interface IAppStatusDropdownProps {
  orderId: string;
  status: EOrderStatus;
  disabled: boolean;
  fullWidth?: boolean;
  onStatusUpdate: (orderId: string, newStatus: EOrderStatus) => void;
}

const STATUS_VALUES = Object.keys(ORDER_STATUS_CONFIG).map(
  (v) => Number(v) as EOrderStatus,
);

function isStatusTransitionAllowed(
  current: EOrderStatus,
  target: EOrderStatus,
): boolean {
  if (current === target) return true;

  const terminal = [
    EOrderStatus.CANCELLED,
    EOrderStatus.RETURNED,
    EOrderStatus.RETURN_REJECTED,
  ];
  if (terminal.includes(current)) return false;

  const transitions: Partial<Record<EOrderStatus, EOrderStatus[]>> = {
    [EOrderStatus.PENDING]: [EOrderStatus.PAID, EOrderStatus.CANCELLED],
    [EOrderStatus.PAID]: [EOrderStatus.SHIPPING, EOrderStatus.CANCELLED],
    [EOrderStatus.SHIPPING]: [EOrderStatus.DELIVERED],
    [EOrderStatus.DELIVERED]: [EOrderStatus.RETURN_REQUESTED],
    [EOrderStatus.CANCEL_REQUESTED]: [
      EOrderStatus.CANCEL_PROCESSING,
      EOrderStatus.CANCELLED,
    ],
    [EOrderStatus.CANCEL_PROCESSING]: [EOrderStatus.CANCELLED],
    [EOrderStatus.RETURN_REQUESTED]: [
      EOrderStatus.RETURN_PROCESSING,
      EOrderStatus.RETURN_REJECTED,
    ],
    [EOrderStatus.RETURN_PROCESSING]: [
      EOrderStatus.RETURNED,
      EOrderStatus.RETURN_REJECTED,
    ],
  };

  return transitions[current]?.includes(target) ?? false;
}

export function AppStatusDropdown({
  orderId,
  status,
  disabled,
  fullWidth = false,
  onStatusUpdate,
}: IAppStatusDropdownProps) {
  const tStatus = useTranslations("OrderStatus");
  const tResults = useTranslations("AdminOrdersPage.results");
  const [isOpen, setIsOpen] = useState(false);

  const getStatusLabel = useCallback(
    (s: number) => {
      switch (s) {
        case EOrderStatus.PENDING:
          return tStatus("pending");
        case EOrderStatus.PAID:
          return tStatus("paid");
        case EOrderStatus.SHIPPING:
          return tStatus("shipping");
        case EOrderStatus.DELIVERED:
          return tStatus("delivered");
        case EOrderStatus.CANCEL_REQUESTED:
          return tStatus("cancelRequested");
        case EOrderStatus.CANCEL_PROCESSING:
          return tStatus("cancelProcessing");
        case EOrderStatus.CANCELLED:
          return tStatus("cancelled");
        case EOrderStatus.RETURN_REQUESTED:
          return tStatus("returnRequested");
        case EOrderStatus.RETURN_PROCESSING:
          return tStatus("returnProcessing");
        case EOrderStatus.RETURNED:
          return tStatus("returned");
        case EOrderStatus.RETURN_REJECTED:
          return tStatus("returnRejected");
        default:
          return tResults("unknown");
      }
    },
    [tResults, tStatus],
  );

  const statusColor =
    ORDER_STATUS_CONFIG[status]?.color || "text-content/50 bg-content/10";
  const statusLabel = getStatusLabel(status);

  const isTriggerDisabled =
    disabled ||
    status === EOrderStatus.CANCELLED ||
    status === EOrderStatus.RETURNED;

  return (
    <RACMenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <RACButton
        type="button"
        isDisabled={isTriggerDisabled}
        className={({ isPressed }) =>
          cn(
            "focus-visible:ring-primary/30 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:outline-none",
            statusColor,
            isTriggerDisabled
              ? "cursor-not-allowed opacity-65"
              : "cursor-pointer border-transparent hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
            isPressed && !isTriggerDisabled && "scale-[0.98]",
            fullWidth &&
              "bg-surface border-content/10 h-10 w-full justify-between rounded-md border px-3",
          )
        }
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="relative flex size-1.5 shrink-0 rounded-full bg-current" />
          <span className="truncate">{statusLabel}</span>
        </div>
        {disabled ? (
          <RefreshCw className="size-3 shrink-0 animate-spin opacity-60" />
        ) : status === EOrderStatus.CANCELLED ||
          status === EOrderStatus.RETURNED ? null : (
          <ChevronDown
            className={cn(
              "size-3 shrink-0 opacity-60 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        )}
      </RACButton>

      <RACPopover
        placement="bottom start"
        className="border-content/[0.08] bg-surface/95 z-[99999] min-w-[180px] rounded-xl border p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl outline-none"
      >
        <RACMenu
          onAction={(key) =>
            onStatusUpdate(orderId, Number(key) as EOrderStatus)
          }
          className="flex flex-col gap-1 outline-none"
        >
          {STATUS_VALUES.map((optionValue) => {
            const isSelected = optionValue === status;
            const isAllowed = isStatusTransitionAllowed(status, optionValue);

            return (
              <RACMenuItem
                key={optionValue}
                id={optionValue}
                isDisabled={!isAllowed}
                className={({ isDisabled, isFocused }) =>
                  cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-150 outline-none select-none",
                    isDisabled
                      ? "text-content/30 cursor-not-allowed bg-transparent opacity-50"
                      : isSelected
                        ? "text-primary bg-primary/[0.05]"
                        : isFocused
                          ? "text-content bg-content/[0.04]"
                          : "text-content/75 bg-transparent",
                  )
                }
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      isSelected ? "bg-primary" : "bg-content/30",
                    )}
                  />
                  <span className="truncate">
                    {getStatusLabel(optionValue)}
                  </span>
                </div>
                {isSelected && (
                  <span className="bg-primary size-1 shrink-0 rounded-full" />
                )}
              </RACMenuItem>
            );
          })}
        </RACMenu>
      </RACPopover>
    </RACMenuTrigger>
  );
}
