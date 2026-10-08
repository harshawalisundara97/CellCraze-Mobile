"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { StatusMarker } from "@/components/ui/status-marker";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";

interface AdminOrderItem {
  id: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface AddressSnapshot {
  recipientName?: string;
  phone?: string;
  line1?: string;
  line2?: string | null;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  addressSnapshot: AddressSnapshot;
  items: AdminOrderItem[];
  payment: {
    method: string;
    status: string;
    stripePaymentIntentId: string | null;
  } | null;
  user: { name: string | null; email: string; phone: string | null } | null;
}

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderDetailPage() {
  return (
    <Suspense fallback={<p className="text-[14px] text-muted">Loading order...</p>}>
      <AdminOrderDetailContent />
    </Suspense>
  );
}

function AdminOrderDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: order, loading, error, refetch } = useApi<AdminOrder>(
    id ? `/api/admin/orders/${id}` : null,
  );

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    if (!id || status === order?.status) return;
    setUpdating(true);
    setUpdateError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not update status.");
      }
      refetch();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="text-[14px] text-muted">Loading order...</p>;
  }

  if (error || !order) {
    return (
      <div>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-[14px] text-accent hover:underline mb-6">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
        <h1 className="text-[24px] font-[800]">Order not found</h1>
      </div>
    );
  }

  const addr = order.addressSnapshot ?? {};

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-[14px] text-accent hover:underline mb-6"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-[800]">{order.orderNumber}</h1>
          <p className="text-[14px] text-muted mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusMarker status={order.status as any} />
          <Tag variant="accent">{order.status}</Tag>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 mb-8">
        {/* Order Items */}
        <div>
          <h2 className="text-[20px] font-[800] mb-4">Order Items</h2>
          <div className="border-t-2 border-divider">
            <div className="grid grid-cols-[1fr_100px_80px_100px_100px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
              <span>Product</span>
              <span>SKU</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Unit Price</span>
              <span className="text-right">Total</span>
            </div>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_100px_80px_100px_100px] gap-4 items-center py-3 border-b border-divider text-[14px]"
              >
                <span className="font-[800]">{item.productName}</span>
                <span className="tnum text-muted">{item.productSku}</span>
                <span className="text-center tnum">{item.quantity}</span>
                <span className="text-right tnum">{formatCurrency(item.unitPrice)}</span>
                <span className="text-right tnum font-[800]">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer + Address */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-[20px] font-[800] mb-4">Customer</h2>
            <div className="border-t-2 border-divider pt-4 space-y-2">
              <p className="text-[14px] font-[800]">{order.user?.name ?? addr.recipientName ?? "—"}</p>
              <p className="text-[14px] text-muted">{order.user?.email ?? "—"}</p>
              <p className="text-[14px] text-muted">{order.user?.phone ?? addr.phone ?? "—"}</p>
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-[800] mb-4">Shipping Address</h2>
            <div className="border-t-2 border-divider pt-4 text-[14px] text-muted space-y-1">
              {addr.recipientName && <p className="text-ink font-[600]">{addr.recipientName}</p>}
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>{addr.city}{addr.city && addr.province ? ", " : ""}{addr.province}</p>
              <p>{addr.postalCode}</p>
              <p>{addr.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-8">
        <h2 className="text-[20px] font-[800] mb-4">Order Summary</h2>
        <div className="border-t-2 border-divider max-w-[400px]">
          <div className="flex justify-between py-3 border-b border-divider text-[14px]">
            <span className="text-muted">Subtotal</span>
            <span className="tnum">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-divider text-[14px]">
            <span className="text-muted">Shipping</span>
            <span className="tnum">{formatCurrency(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between py-3 border-b-2 border-divider text-[14px]">
            <span className="font-[800]">Total</span>
            <span className="font-[800] tnum">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="mb-8">
        <h2 className="text-[20px] font-[800] mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <Button
              key={s}
              variant={s === order.status ? "primary" : "secondary"}
              onClick={() => updateStatus(s)}
              disabled={updating || s === order.status}
            >
              {s}
            </Button>
          ))}
        </div>
        {updateError && <p className="text-[13px] text-accent mt-3">{updateError}</p>}
      </div>

      {/* Payment Info */}
      {order.payment && (
        <div>
          <h2 className="text-[20px] font-[800] mb-4">Payment</h2>
          <div className="border-t-2 border-divider max-w-[400px]">
            <div className="flex justify-between py-3 border-b border-divider text-[14px]">
              <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60">Method</span>
              <span>{order.payment.method}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-divider text-[14px]">
              <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60">Status</span>
              <Tag variant="accent">{order.payment.status}</Tag>
            </div>
            {order.payment.stripePaymentIntentId && (
              <div className="flex justify-between py-3 border-b border-divider text-[14px]">
                <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60">Transaction ID</span>
                <span className="tnum text-muted text-[12px]">{order.payment.stripePaymentIntentId}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
