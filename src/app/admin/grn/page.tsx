"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { formatDate } from "@/lib/utils";

const grns = [
  { id: "1", grnNumber: "GRN-2024-0005", poNumber: "PO-2024-0007", supplier: "DigiWorld Imports", status: "CONFIRMED", receivedDate: "2024-12-15T10:00:00Z", itemCount: 2 },
  { id: "2", grnNumber: "GRN-2024-0004", poNumber: "PO-2024-0006", supplier: "TechHub Lanka", status: "CONFIRMED", receivedDate: "2024-12-10T14:00:00Z", itemCount: 4 },
  { id: "3", grnNumber: "GRN-2024-0003", poNumber: "PO-2024-0007", supplier: "DigiWorld Imports", status: "DRAFT", receivedDate: "2024-12-20T09:00:00Z", itemCount: 1 },
];

export default function AdminGRNPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px]">Goods Received Notes</h1>
          <p className="text-[14px] text-muted">{grns.length} GRNs</p>
        </div>
        <Button leadingIcon={<Plus size={16} />}>Create GRN</Button>
      </div>

      <div className="border-t-2 border-divider">
        <div className="grid grid-cols-[130px_120px_1fr_100px_80px_120px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
          <span>GRN Number</span>
          <span>PO Number</span>
          <span>Supplier</span>
          <span>Status</span>
          <span className="text-center">Items</span>
          <span className="text-right">Received</span>
        </div>
        {grns.map((grn) => (
          <div key={grn.id} className="grid grid-cols-[130px_120px_1fr_100px_80px_120px] gap-4 items-center py-3 border-b border-divider text-[14px] hover:bg-ink/[0.02] cursor-pointer transition-colors">
            <span className="font-[800] tnum">{grn.grnNumber}</span>
            <span className="tnum text-muted">{grn.poNumber}</span>
            <span className="truncate">{grn.supplier}</span>
            <Tag variant={grn.status === "CONFIRMED" ? "accent" : "neutral"}>
              {grn.status.toLowerCase()}
            </Tag>
            <span className="text-center tnum text-muted">{grn.itemCount}</span>
            <span className="text-right text-[12px] text-muted">{formatDate(grn.receivedDate)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
