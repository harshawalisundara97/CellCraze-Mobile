"use client";

import Link from "next/link";
import { StatusMarker } from "@/components/ui/status-marker";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

const order = {
  id: "1",
  orderNumber: "CC-00012",
  status: "DELIVERED",
  subtotal: 519700,
  shippingCost: 50000,
  totalAmount: 569700,
  createdAt: "2024-12-15T10:30:00Z",
  addressSnapshot: {
    recipientName: "Nimali Fernando",
    phone: "+94779876543",
    line1: "42 Galle Road",
    city: "Colombo",
    province: "Western",
    postalCode: "10350",
  },
  items: [
    { id: "1", productName: "Galaxy S25 Ultra", productSku: "SM-S938B-256", unitPrice: 389900, quantity: 1, totalPrice: 389900 },
    { id: "2", productName: "Sony WH-1000XM5", productSku: "SONY-WH1000XM5", unitPrice: 89900, quantity: 1, totalPrice: 89900 },
    { id: "3", productName: "Anker USB-C Cable 2m", productSku: "USBC-2M", unitPrice: 2900, quantity: 1, totalPrice: 2900 },
  ],
  payment: { method: "STRIPE", status: "COMPLETED", paidAt: "2024-12-15T10:32:00Z" },
};

const statusTimeline = [
  { status: "CONFIRMED", date: "2024-12-15T10:32:00Z" },
  { status: "PROCESSING", date: "2024-12-15T14:00:00Z" },
  { status: "SHIPPED", date: "2024-12-16T09:00:00Z" },
  { status: "DELIVERED", date: "2024-12-18T14:30:00Z" },
];

export default function OrderDetailPage() {
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
            {statusTimeline.map((step, i) => (
              <div key={step.status} className="flex items-start gap-4 pb-4">
                <div className="flex flex-col items-center">
                  <div className="w-[10px] h-[10px] bg-accent shrink-0 mt-[4px]" />
                  {i < statusTimeline.length - 1 && <div className="w-[2px] h-[32px] bg-divider" />}
                </div>
                <div>
                  <span className="block text-[14px] font-[800] capitalize">
                    {step.status.toLowerCase().replace("_", " ")}
                  </span>
                  <span className="block text-[12px] text-muted">{formatDate(step.date)}</span>
                </div>
              </div>
            ))}
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

          <h3 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
            Payment
          </h3>
          <p className="text-[14px] mb-1">{order.payment.method.replace("_", " ")}</p>
          <p className="text-[12px] text-muted mb-6">{order.payment.status}</p>

          <h3 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
            Delivery address
          </h3>
          <p className="text-[14px]">{order.addressSnapshot.recipientName}</p>
          <p className="text-[13px] text-muted">{order.addressSnapshot.line1}</p>
          <p className="text-[13px] text-muted">
            {order.addressSnapshot.city}, {order.addressSnapshot.province} {order.addressSnapshot.postalCode}
          </p>
          <p className="text-[13px] text-muted">{order.addressSnapshot.phone}</p>
        </div>
      </div>
    </div>
  );
}
