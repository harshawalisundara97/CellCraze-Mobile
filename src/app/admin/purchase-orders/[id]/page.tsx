"use client";

import Link from "next/link";
import { ArrowLeft, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { formatCurrency, formatDate } from "@/lib/utils";

const poData = {
  id: "1",
  poNumber: "PO-2024-0008",
  supplier: "MobiTech Distributors",
  supplierEmail: "orders@mobitech.lk",
  supplierPhone: "+94 11 234 5678",
  status: "SENT" as string,
  createdAt: "2024-12-18T09:00:00Z",
  notes: "Urgent order for holiday season stock.",
  items: [
    { id: "i1", product: "iPhone 15 Pro Max 256GB", qtyOrdered: 10, qtyReceived: 0, unitCost: 389900 },
    { id: "i2", product: "Samsung Galaxy S24 Ultra 512GB", qtyOrdered: 8, qtyReceived: 0, unitCost: 349900 },
    { id: "i3", product: "Google Pixel 8 Pro 128GB", qtyOrdered: 5, qtyReceived: 0, unitCost: 219900 },
  ],
};

const statusTag: Record<string, "accent" | "neutral" | "outline"> = {
  DRAFT: "neutral",
  SENT: "outline",
  PARTIALLY_RECEIVED: "accent",
  FULLY_RECEIVED: "neutral",
  CANCELLED: "neutral",
};

export default function PurchaseOrderDetailPage() {
  const po = poData;
  const totalAmount = po.items.reduce((sum, item) => sum + item.qtyOrdered * item.unitCost, 0);

  return (
    <div>
      <Link
        href="/admin/purchase-orders"
        className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to Purchase Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[32px] font-[800]">{po.poNumber}</h1>
            <Tag variant={statusTag[po.status] || "neutral"}>
              {po.status.replace(/_/g, " ").toLowerCase()}
            </Tag>
          </div>
          <p className="text-[14px] text-muted">{formatDate(po.createdAt)}</p>
        </div>

        <div className="flex items-center gap-3">
          {po.status === "DRAFT" && (
            <Button variant="primary" leadingIcon={<Send size={16} />}>
              Mark as Sent
            </Button>
          )}
          {(po.status === "SENT" || po.status === "PARTIALLY_RECEIVED") && (
            <Link href="/admin/grn/new">
              <Button variant="primary" leadingIcon={<FileText size={16} />}>
                Create GRN
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Supplier Info */}
      <section className="mb-8">
        <h2 className="text-[20px] font-[800] mb-4">Supplier</h2>
        <div className="border-t-2 border-divider pt-4 space-y-2">
          <div className="flex gap-8">
            <div>
              <span className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-0.5">
                Name
              </span>
              <span className="text-[14px]">{po.supplier}</span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-0.5">
                Email
              </span>
              <span className="text-[14px]">{po.supplierEmail}</span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-0.5">
                Phone
              </span>
              <span className="text-[14px]">{po.supplierPhone}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Items Table */}
      <section className="mb-8">
        <h2 className="text-[20px] font-[800] mb-4">Items</h2>
        <div className="border-t-2 border-divider">
          <div className="grid grid-cols-[1fr_100px_100px_120px_120px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
            <span>Product</span>
            <span className="text-center">Qty Ordered</span>
            <span className="text-center">Qty Received</span>
            <span className="text-right">Unit Cost</span>
            <span className="text-right">Total</span>
          </div>

          {po.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_100px_100px_120px_120px] gap-4 items-center py-3 border-b border-divider text-[14px]"
            >
              <span>{item.product}</span>
              <span className="text-center tnum">{item.qtyOrdered}</span>
              <span className="text-center tnum">{item.qtyReceived}</span>
              <span className="text-right tnum">{formatCurrency(item.unitCost)}</span>
              <span className="text-right font-[800] tnum">
                {formatCurrency(item.qtyOrdered * item.unitCost)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section>
        <div className="border-t-2 border-divider pt-4 max-w-[320px] ml-auto">
          <div className="flex justify-between items-center py-2">
            <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60">
              Total Amount
            </span>
            <span className="text-[20px] font-[800] tnum">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
