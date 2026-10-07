"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tag } from "@/components/ui/tag";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
];

const invoices = [
  { id: "1", invoiceNumber: "INV-2024-0012", orderNumber: "CC-00012", customer: "Nimali Fernando", status: "PAID", totalAmount: 569700, createdAt: "2024-12-18T10:00:00Z", paidAt: "2024-12-18T10:32:00Z" },
  { id: "2", invoiceNumber: "INV-2024-0011", orderNumber: "CC-00011", customer: "Kasun Perera", status: "SENT", totalAmount: 24900, createdAt: "2024-12-14T16:00:00Z", paidAt: null },
  { id: "3", invoiceNumber: "INV-2024-0010", orderNumber: "CC-00010", customer: "Amal Silva", status: "OVERDUE", totalAmount: 179800, createdAt: "2024-12-08T09:00:00Z", paidAt: null },
  { id: "4", invoiceNumber: "INV-2024-0009", orderNumber: "CC-00009", customer: "Priya Jayasuriya", status: "PAID", totalAmount: 449900, createdAt: "2024-12-05T14:00:00Z", paidAt: "2024-12-06T11:00:00Z" },
];

const statusTag: Record<string, "accent" | "neutral" | "outline"> = {
  DRAFT: "neutral",
  SENT: "outline",
  PAID: "accent",
  OVERDUE: "accent",
  CANCELLED: "neutral",
};

export default function AdminInvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = invoices.filter((inv) => statusFilter === "all" || inv.status === statusFilter);

  return (
    <div>
      <h1 className="text-[32px] mb-1">Invoices</h1>
      <p className="text-[14px] text-muted mb-6">{invoices.length} invoices</p>

      <div className="mb-6">
        <SegmentedControl options={statusOptions} value={statusFilter} onChange={setStatusFilter} name="status" />
      </div>

      <div className="border-t-2 border-divider">
        <div className="grid grid-cols-[140px_110px_1fr_100px_140px_120px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
          <span>Invoice</span>
          <span>Order</span>
          <span>Customer</span>
          <span>Status</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Date</span>
        </div>
        {filtered.map((inv) => (
          <div key={inv.id} className="grid grid-cols-[140px_110px_1fr_100px_140px_120px] gap-4 items-center py-3 border-b border-divider text-[14px] hover:bg-ink/[0.02] cursor-pointer transition-colors">
            <span className="font-[800] tnum">{inv.invoiceNumber}</span>
            <span className="tnum text-muted">{inv.orderNumber}</span>
            <span className="truncate">{inv.customer}</span>
            <Tag variant={statusTag[inv.status] || "neutral"}>
              {inv.status.toLowerCase()}
            </Tag>
            <span className="text-right font-[800] tnum">{formatCurrency(inv.totalAmount)}</span>
            <span className="text-right text-[12px] text-muted">{formatDate(inv.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
