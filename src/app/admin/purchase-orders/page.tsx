"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tag } from "@/components/ui/tag";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Partial", value: "PARTIALLY_RECEIVED" },
  { label: "Complete", value: "FULLY_RECEIVED" },
];

const purchaseOrders = [
  { id: "1", poNumber: "PO-2024-0008", supplier: "MobiTech Distributors", status: "SENT", totalAmount: 6400000, itemCount: 5, createdAt: "2024-12-18T09:00:00Z" },
  { id: "2", poNumber: "PO-2024-0007", supplier: "DigiWorld Imports", status: "PARTIALLY_RECEIVED", totalAmount: 2200000, itemCount: 3, createdAt: "2024-12-12T11:00:00Z" },
  { id: "3", poNumber: "PO-2024-0006", supplier: "TechHub Lanka", status: "FULLY_RECEIVED", totalAmount: 1800000, itemCount: 4, createdAt: "2024-12-05T14:30:00Z" },
  { id: "4", poNumber: "PO-2024-0005", supplier: "MobiTech Distributors", status: "DRAFT", totalAmount: 3500000, itemCount: 6, createdAt: "2024-12-01T10:00:00Z" },
];

const statusTag: Record<string, "accent" | "neutral" | "outline"> = {
  DRAFT: "neutral",
  SENT: "outline",
  PARTIALLY_RECEIVED: "accent",
  FULLY_RECEIVED: "neutral",
  CANCELLED: "neutral",
};

export default function AdminPurchaseOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = purchaseOrders.filter((po) => statusFilter === "all" || po.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px]">Purchase Orders</h1>
          <p className="text-[14px] text-muted">{purchaseOrders.length} purchase orders</p>
        </div>
        <Button leadingIcon={<Plus size={16} />}>Create PO</Button>
      </div>

      <div className="mb-6">
        <SegmentedControl options={statusOptions} value={statusFilter} onChange={setStatusFilter} name="status" />
      </div>

      <div className="border-t-2 border-divider">
        <div className="grid grid-cols-[120px_1fr_140px_80px_140px_120px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
          <span>PO Number</span>
          <span>Supplier</span>
          <span>Status</span>
          <span className="text-center">Items</span>
          <span className="text-right">Total</span>
          <span className="text-right">Date</span>
        </div>
        {filtered.map((po) => (
          <div key={po.id} className="grid grid-cols-[120px_1fr_140px_80px_140px_120px] gap-4 items-center py-3 border-b border-divider text-[14px] hover:bg-ink/[0.02] cursor-pointer transition-colors">
            <span className="font-[800] tnum">{po.poNumber}</span>
            <span className="truncate">{po.supplier}</span>
            <Tag variant={statusTag[po.status] || "neutral"}>
              {po.status.replace(/_/g, " ").toLowerCase()}
            </Tag>
            <span className="text-center tnum text-muted">{po.itemCount}</span>
            <span className="text-right font-[800] tnum">{formatCurrency(po.totalAmount)}</span>
            <span className="text-right text-[12px] text-muted">{formatDate(po.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
