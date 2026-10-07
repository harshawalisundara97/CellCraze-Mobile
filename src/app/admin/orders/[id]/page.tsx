"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { StatusMarker } from "@/components/ui/status-marker";
import { formatCurrency, formatDate } from "@/lib/utils";

const order = {
  id: "1",
  orderNumber: "CC-00015",
  customer: "Amal Silva",
  email: "amal@example.com",
  phone: "+94 77 123 4567",
  status: "CONFIRMED",
  items: [
    {
      id: "item-1",
      productName: "Galaxy S25 Ultra",
      sku: "SM-S938B-256",
      unitPrice: 389900,
      quantity: 1,
    },
    {
      id: "item-2",
      productName: "Spigen Ultra Hybrid Case",
      sku: "SPG-ULTRA",
      unitPrice: 4900,
      quantity: 2,
    },
  ],
  address: {
    line1: "42 Galle Road",
    line2: "Colombo 03",
    city: "Colombo",
    province: "Western",
    postalCode: "00300",
    country: "Sri Lanka",
  },
  payment: {
    method: "STRIPE",
    status: "COMPLETED",
    transactionId: "pi_3PxYz1234567890",
  },
  subtotal: 399700,
  shipping: 35000,
  total: 434700,
  createdAt: "2024-12-20T10:30:00Z",
};

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderDetailPage() {
  const [currentStatus, setCurrentStatus] = useState(order.status);

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
          <StatusMarker status={currentStatus as any} />
          <Tag variant="accent">{currentStatus}</Tag>
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
                <span className="tnum text-muted">{item.sku}</span>
                <span className="text-center tnum">{item.quantity}</span>
                <span className="text-right tnum">{formatCurrency(item.unitPrice)}</span>
                <span className="text-right tnum font-[800]">
                  {formatCurrency(item.unitPrice * item.quantity)}
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
              <p className="text-[14px] font-[800]">{order.customer}</p>
              <p className="text-[14px] text-muted">{order.email}</p>
              <p className="text-[14px] text-muted">{order.phone}</p>
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-[800] mb-4">Shipping Address</h2>
            <div className="border-t-2 border-divider pt-4 text-[14px] text-muted space-y-1">
              <p>{order.address.line1}</p>
              <p>{order.address.line2}</p>
              <p>{order.address.city}, {order.address.province}</p>
              <p>{order.address.postalCode}</p>
              <p>{order.address.country}</p>
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
            <span className="tnum">{formatCurrency(order.shipping)}</span>
          </div>
          <div className="flex justify-between py-3 border-b-2 border-divider text-[14px]">
            <span className="font-[800]">Total</span>
            <span className="font-[800] tnum">{formatCurrency(order.total)}</span>
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
              variant={s === currentStatus ? "primary" : "secondary"}
              onClick={() => setCurrentStatus(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Payment Info */}
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
          <div className="flex justify-between py-3 border-b border-divider text-[14px]">
            <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60">Transaction ID</span>
            <span className="tnum text-muted text-[12px]">{order.payment.transactionId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
