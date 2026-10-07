"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusMarker } from "@/components/ui/status-marker";
import { formatCurrency, formatDate } from "@/lib/utils";

const orders = [
  { id: "1", orderNumber: "CC-00012", status: "DELIVERED", totalAmount: 569700, createdAt: "2024-12-15T10:30:00Z", itemCount: 3 },
  { id: "2", orderNumber: "CC-00011", status: "SHIPPED", totalAmount: 389900, createdAt: "2024-12-10T14:20:00Z", itemCount: 1 },
  { id: "3", orderNumber: "CC-00010", status: "PROCESSING", totalAmount: 179800, createdAt: "2024-12-08T09:15:00Z", itemCount: 2 },
  { id: "4", orderNumber: "CC-00009", status: "CANCELLED", totalAmount: 89900, createdAt: "2024-11-28T16:45:00Z", itemCount: 1 },
];

export default function OrdersPage() {
  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Orders</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-2">My orders</h1>
      <p className="text-[15px] text-muted mb-8">{orders.length} orders</p>

      <div className="border-t-2 border-divider">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center gap-5 py-5 border-b border-divider hover:bg-ink/[0.02] transition-colors"
          >
            <span className="text-[15px] font-[800] tnum w-[110px] shrink-0">{order.orderNumber}</span>
            <StatusMarker status={order.status as any} />
            <span className="text-[14px] capitalize flex-1">
              {order.status.toLowerCase().replace("_", " ")}
            </span>
            <span className="text-[13px] text-muted shrink-0">{order.itemCount} item{order.itemCount !== 1 ? "s" : ""}</span>
            <span className="text-[13px] text-muted shrink-0 w-[100px]">{formatDate(order.createdAt)}</span>
            <span className="text-[15px] font-[800] tnum shrink-0 w-[120px] text-right">
              {formatCurrency(order.totalAmount)}
            </span>
            <ArrowRight size={16} className="text-ink/30 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
