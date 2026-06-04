import {
  CalendarDays,
  CreditCard,
  Hash,
  Mail,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";

import { DetailField } from "@/components/molecules/detail-field";
import {
  formatCurrency,
  formatDate,
} from "@/components/organisms/orders-view/order.utils";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";

import { getCustomerName, getShippingAddress } from "./order-detail.utils";
import { SectionTitle } from "./section-title";

interface IOverviewSectionProps {
  order: IAdminCustomerOrder;
  subtotal: number;
}

export const OverviewSection = ({ order, subtotal }: IOverviewSectionProps) => (
  <div className="grid border-t border-[var(--border-color)] lg:grid-cols-4">
    <div className="border-b border-[var(--border-color)] p-5 lg:border-r lg:border-b-0">
      <SectionTitle icon={User} title="Customer" />
      <div className="space-y-3">
        <DetailField label="Name" value={getCustomerName(order)} icon={User} />
        <DetailField
          label="Email"
          value={order.user?.email ?? "No email"}
          icon={Mail}
        />
        <DetailField label="User ID" value={order.userId} icon={Hash} />
      </div>
    </div>

    <div className="border-b border-[var(--border-color)] p-5 lg:border-r lg:border-b-0">
      <SectionTitle icon={MapPin} title="Shipping" />
      <div className="space-y-3">
        <DetailField
          label="Receiver"
          value={order.shippingAddress?.receiverName ?? "No receiver"}
          icon={User}
        />
        <DetailField
          label="Phone"
          value={order.shippingAddress?.receiverPhone ?? "No phone"}
          icon={Phone}
        />
        <DetailField
          label="Address"
          value={getShippingAddress(order)}
          icon={MapPin}
        />
      </div>
    </div>

    <div className="border-b border-[var(--border-color)] p-5 lg:border-r lg:border-b-0">
      <SectionTitle icon={CreditCard} title="Payment" />
      <div className="space-y-3">
        <DetailField
          label="Subtotal"
          value={formatCurrency(subtotal)}
          icon={CreditCard}
        />
        <DetailField
          label="Discount"
          value={`-${formatCurrency(Number(order.discountAmount ?? 0))}`}
          icon={CreditCard}
        />
        <DetailField
          label="Total"
          value={formatCurrency(Number(order.totalAmount))}
          icon={CreditCard}
        />
      </div>
    </div>

    <div className="p-5">
      <SectionTitle icon={Truck} title="Metadata" />
      <div className="space-y-3">
        <DetailField
          label="Created"
          value={formatDate(order.createdAt, {
            hour: "2-digit",
            minute: "2-digit",
          })}
          icon={CalendarDays}
        />
        <DetailField
          label="Updated"
          value={formatDate(order.updatedAt, {
            hour: "2-digit",
            minute: "2-digit",
          })}
          icon={CalendarDays}
        />
        <DetailField
          label="Coupon"
          value={order.couponId ?? "None"}
          icon={Hash}
        />
      </div>
    </div>
  </div>
);
