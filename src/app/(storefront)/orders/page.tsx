"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusMarker } from "@/components/ui/status-marker";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";

interface OrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { id: string; quantity: number }[];
}

interface OrdersResponse {
  orders: OrderListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export default function OrdersPage() {
  const { data, loading, error } = useApi<OrdersResponse>("/api/orders");
  const orders = data?.orders ?? [];

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Orders</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-2">My orders</h1>

      {loading ? (
        <p className="text-[15px] text-muted mb-8">Loading orders...</p>
      ) : error ? (
        <p className="text-[15px] text-muted mb-8">
          Please <Link href="/login" className="text-ink font-semibold hover:underline">sign in</Link> to view your orders.
        </p>
      ) : orders.length === 0 ? (
        <p className="text-[15px] text-muted mb-8">
          You have no orders yet.{" "}
          <Link href="/products" className="text-ink font-semibold hover:underline">Start shopping</Link>.
        </p>
      ) : (
        <>
          <p className="text-[15px] text-muted mb-8">{orders.length} orders</p>
          <div className="border-t-2 border-divider">
            {orders.map((order) => {
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
              return (
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
                  <span className="text-[13px] text-muted shrink-0">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                  <span className="text-[13px] text-muted shrink-0 w-[100px]">{formatDate(order.createdAt)}</span>
                  <span className="text-[15px] font-[800] tnum shrink-0 w-[120px] text-right">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <ArrowRight size={16} className="text-ink/30 shrink-0" />
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
