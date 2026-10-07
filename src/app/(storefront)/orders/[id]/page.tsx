"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusMarker } from "@/components/ui/status-marker";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";

interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface AddressSnapshot {
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  province: string;
  postalCode: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  createdAt: string;
  addressSnapshot: AddressSnapshot;
  items: OrderItem[];
  payment: { method: string; status: string; paidAt: string | null } | null;
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: order, loading, error } = useApi<OrderDetail>(
    id ? `/api/orders/${id}` : null,
  );

  if (loading) {
    return <div className="px-[40px] py-16 text-[15px] text-muted max-md:px-gutter-mobile">Loading order...</div>;
  }

  if (error || !order) {
    return (
      <div className="px-[40px] py-16 max-md:px-gutter-mobile">
        <h1 className="text-[32px] mb-3">Order not found</h1>
        <p className="text-[15px] text-muted">
          <Link href="/orders" className="text-ink font-semibold hover:underline">Back to orders</Link>
        </p>
      </div>
    );
  }

  const addr = order.addressSnapshot;

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/orders" className="hover:text-ink">Orders</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">{order.orderNumber}</span>
      </nav>

      <div className="flex items-baseline gap-4 mb-8">
        <h1 className="text-[48px] max-md:text-[32px]">{order.orderNumber}</h1>
        <StatusMarker status={order.status as any} />
        <span className="text-[15px] capitalize text-muted">
          {order.status.toLowerCase().replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-0 max-md:grid-cols-1 rule-bottom">
        <div className="pr-10 pb-10 max-md:pr-0 border-r-2 border-divider max-md:border-r-0">
          <h2 className="text-[20px] mb-4">Items</h2>
          <div className="border-t-2 border-divider">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-5 py-4 border-b border-divider">
                <div className="w-[60px] h-[60px] bg-surface grayscale shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[15px] font-[800] truncate">{item.productName}</span>
                  <span className="block text-[12px] text-muted">{item.productSku}</span>
                </div>
                <span className="text-[13px] text-muted shrink-0">x{item.quantity}</span>
                <span className="text-[15px] font-[800] tnum shrink-0">{formatCurrency(item.totalPrice)}</span>
              </div>
            ))}
          </div>

          <h2 className="text-[20px] mt-10 mb-4">Timeline</h2>
          <div className="flex flex-col gap-0">
            <div className="flex items-start gap-4 pb-4">
              <div className="flex flex-col items-center">
                <div className="w-[10px] h-[10px] bg-accent shrink-0 mt-[4px]" />
              </div>
              <div>
                <span className="block text-[14px] font-[800] capitalize">
                  {order.status.toLowerCase().replace("_", " ")}
                </span>
                <span className="block text-[12px] text-muted">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pl-10 pt-0 pb-10 max-md:pl-0 max-md:pt-6">
          <h2 className="text-[20px] mb-4">Summary</h2>
          <div className="flex justify-between text-[14px] mb-2">
            <span className="text-muted">Subtotal</span>
            <span className="tnum">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[14px] mb-4">
            <span className="text-muted">Shipping</span>
            <span className="tnum">{formatCurrency(order.shippingCost)}</span>
          </div>
          <div className="border-t-2 border-divider pt-4 flex justify-between text-[18px] mb-8">
            <span className="font-[800]">Total</span>
            <span className="font-[800] tnum">{formatCurrency(order.totalAmount)}</span>
          </div>

          {order.payment && (
            <>
              <h3 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                Payment
              </h3>
              <p className="text-[14px] mb-1">{order.payment.method.replace("_", " ")}</p>
              <p className="text-[12px] text-muted mb-6">{order.payment.status}</p>
            </>
          )}

          <h3 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
            Delivery address
          </h3>
          <p className="text-[14px]">{addr.recipientName}</p>
          <p className="text-[13px] text-muted">{addr.line1}</p>
          <p className="text-[13px] text-muted">
            {addr.city}, {addr.province} {addr.postalCode}
          </p>
          <p className="text-[13px] text-muted">{addr.phone}</p>
        </div>
      </div>
    </div>
  );
}
