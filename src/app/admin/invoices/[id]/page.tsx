"use client";

import { useState } from "react";
import Link from "next/link";

const mockInvoice = {
  id: "inv-1",
  invoiceNumber: "INV-2024-0012",
  status: "SENT" as string,
  createdAt: "2024-03-15T10:30:00Z",
  dueDate: "2024-04-14",
  paidAt: null as string | null,
  order: {
    id: "ord-1",
    orderNumber: "CC-00012",
  },
  customer: {
    name: "Nimali Fernando",
    email: "nimali@example.com",
    phone: "+94 77 123 4567",
  },
  items: [
    {
      id: "ii-1",
      description: "Samsung Galaxy S24 Ultra Case — Midnight Black",
      quantity: 2,
      unitPrice: 249900,
      totalPrice: 499800,
    },
    {
      id: "ii-2",
      description: "USB-C Fast Charger 25W",
      quantity: 1,
      unitPrice: 189900,
      totalPrice: 189900,
    },
    {
      id: "ii-3",
      description: "Wireless Earbuds Pro",
      quantity: 1,
      unitPrice: 489900,
      totalPrice: 489900,
    },
  ],
  subtotal: 1179600,
  taxAmount: 0,
  totalAmount: 1179600,
};

function formatCurrency(cents: number): string {
  return `Rs ${(cents / 100).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: "bg-neutral-200 text-neutral-700",
    SENT: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-neutral-300 text-neutral-600",
  };
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider ${colors[status] || "bg-neutral-100 text-neutral-600"}`}>
      {status}
    </span>
  );
}

export default function InvoiceDetailPage() {
  const [invoice] = useState(mockInvoice);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/invoices" className="text-sm text-neutral-500 hover:text-[#ec3013]">
              ← Back to Invoices
            </Link>
          </div>
          <h1 className="text-2xl font-[800] uppercase tracking-tight">{invoice.invoiceNumber}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Created {new Date(invoice.createdAt).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}
            {" · "}Due {new Date(invoice.dueDate).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="border-2 border-neutral-900 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-neutral-100">
          Download PDF
        </button>
        <button className="border-2 border-neutral-900 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-neutral-100">
          Send Email
        </button>
        {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
          <button className="bg-[#ec3013] text-white px-5 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-red-700">
            Mark as Paid
          </button>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-neutral-900 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Order</h3>
          <Link href={`/admin/orders/${invoice.order.id}`} className="text-sm font-semibold hover:text-[#ec3013]">
            {invoice.order.orderNumber}
          </Link>
        </div>
        <div className="border-2 border-neutral-900 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Customer</h3>
          <p className="text-sm font-semibold">{invoice.customer.name}</p>
          <p className="text-xs text-neutral-500 mt-1">{invoice.customer.email}</p>
          <p className="text-xs text-neutral-500">{invoice.customer.phone}</p>
        </div>
        <div className="border-2 border-neutral-900 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Payment</h3>
          <p className="text-sm font-semibold">{formatCurrency(invoice.totalAmount)}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {invoice.paidAt
              ? `Paid ${new Date(invoice.paidAt).toLocaleDateString("en-LK")}`
              : `Due ${new Date(invoice.dueDate).toLocaleDateString("en-LK")}`}
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="border-2 border-neutral-900">
        <div className="p-5 border-b-2 border-neutral-900">
          <h3 className="text-sm font-[800] uppercase tracking-wider">Line Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-900 bg-neutral-50">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Description</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Qty</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Unit Price</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-neutral-200">
                  <td className="p-4 font-semibold">{item.description}</td>
                  <td className="p-4 text-right">{item.quantity}</td>
                  <td className="p-4 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-4 text-right font-semibold">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Totals */}
        <div className="border-t-2 border-neutral-900 p-5">
          <div className="flex flex-col items-end gap-2">
            <div className="flex justify-between w-full max-w-[300px] text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[300px] text-sm">
              <span className="text-neutral-500">Tax</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between w-full max-w-[300px] text-sm border-t-2 border-neutral-900 pt-2 mt-1">
              <span className="font-[800] uppercase tracking-wider">Total</span>
              <span className="font-[800] text-lg">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
