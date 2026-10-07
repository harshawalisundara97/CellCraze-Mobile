"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const availablePOs = [
  {
    id: "po1",
    poNumber: "PO-2024-0008",
    supplier: "MobiTech Distributors",
    status: "SENT",
    items: [
      { id: "i1", product: "iPhone 15 Pro Max 256GB", qtyOrdered: 10, qtyAlreadyReceived: 0 },
      { id: "i2", product: "Samsung Galaxy S24 Ultra 512GB", qtyOrdered: 8, qtyAlreadyReceived: 0 },
      { id: "i3", product: "Google Pixel 8 Pro 128GB", qtyOrdered: 5, qtyAlreadyReceived: 0 },
    ],
  },
  {
    id: "po2",
    poNumber: "PO-2024-0007",
    supplier: "DigiWorld Imports",
    status: "PARTIALLY_RECEIVED",
    items: [
      { id: "i4", product: "OnePlus 12 256GB", qtyOrdered: 12, qtyAlreadyReceived: 5 },
      { id: "i5", product: "Xiaomi 14 Ultra 512GB", qtyOrdered: 6, qtyAlreadyReceived: 3 },
      { id: "i6", product: "Nothing Phone (2) 256GB", qtyOrdered: 10, qtyAlreadyReceived: 10 },
    ],
  },
];

interface ReceiveLine {
  itemId: string;
  receivedQty: number;
  rejectedQty: number;
  notes: string;
}

export default function NewGRNPage() {
  const [selectedPOId, setSelectedPOId] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [overallNotes, setOverallNotes] = useState("");
  const [lineData, setLineData] = useState<Record<string, ReceiveLine>>({});

  const selectedPO = availablePOs.find((po) => po.id === selectedPOId);

  function handlePOChange(poId: string) {
    setSelectedPOId(poId);
    const po = availablePOs.find((p) => p.id === poId);
    if (po) {
      const newLineData: Record<string, ReceiveLine> = {};
      po.items.forEach((item) => {
        newLineData[item.id] = { itemId: item.id, receivedQty: 0, rejectedQty: 0, notes: "" };
      });
      setLineData(newLineData);
    } else {
      setLineData({});
    }
  }

  function updateLineField(itemId: string, field: keyof ReceiveLine, value: string | number) {
    setLineData((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  }

  return (
    <div>
      <Link
        href="/admin/grn"
        className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to GRNs
      </Link>

      <h1 className="text-[32px] font-[800] mb-8">New GRN</h1>

      {/* PO Selection */}
      <section className="mb-8">
        <h2 className="text-[20px] font-[800] mb-4">Purchase Order</h2>
        <div className="border-t-2 border-divider pt-4 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-1.5">
              Select Purchase Order
            </label>
            <select
              value={selectedPOId}
              onChange={(e) => handlePOChange(e.target.value)}
              className="min-h-[36px] w-full max-w-[400px] rounded-none border border-divider bg-surface px-[10px] py-[6px] text-[14px] text-ink focus:border-accent focus:outline-none"
            >
              <option value="">-- Select a PO --</option>
              {availablePOs.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.poNumber} - {po.supplier} ({po.status.replace(/_/g, " ").toLowerCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-1.5">
              Received Date
            </label>
            <Input
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
              className="max-w-[240px]"
            />
          </div>
        </div>
      </section>

      {/* Items */}
      {selectedPO && (
        <section className="mb-8">
          <h2 className="text-[20px] font-[800] mb-4">Items</h2>
          <div className="border-t-2 border-divider">
            <div className="grid grid-cols-[1fr_80px_80px_80px_80px_1fr] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
              <span>Product</span>
              <span className="text-center">Ordered</span>
              <span className="text-center">Already Rcvd</span>
              <span className="text-center">Received</span>
              <span className="text-center">Rejected</span>
              <span>Notes</span>
            </div>

            {selectedPO.items.map((item) => {
              const line = lineData[item.id];
              if (!line) return null;
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_80px_80px_80px_80px_1fr] gap-4 items-center py-3 border-b border-divider text-[14px]"
                >
                  <span>{item.product}</span>
                  <span className="text-center tnum text-muted">{item.qtyOrdered}</span>
                  <span className="text-center tnum text-muted">{item.qtyAlreadyReceived}</span>
                  <Input
                    type="number"
                    min={0}
                    value={line.receivedQty}
                    onChange={(e) =>
                      updateLineField(item.id, "receivedQty", parseInt(e.target.value) || 0)
                    }
                    className="text-center tnum"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={line.rejectedQty}
                    onChange={(e) =>
                      updateLineField(item.id, "rejectedQty", parseInt(e.target.value) || 0)
                    }
                    className="text-center tnum"
                  />
                  <Input
                    type="text"
                    value={line.notes}
                    onChange={(e) => updateLineField(item.id, "notes", e.target.value)}
                    placeholder="Notes..."
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Notes */}
      <section className="mb-8">
        <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-1.5">
          Overall Notes
        </label>
        <textarea
          value={overallNotes}
          onChange={(e) => setOverallNotes(e.target.value)}
          rows={3}
          placeholder="Add any notes for this GRN..."
          className="w-full rounded-none border border-divider bg-surface px-[10px] py-[8px] text-[14px] text-ink placeholder:text-neutral-500 focus:border-accent focus:outline-none resize-y"
        />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t-2 border-divider pt-6">
        <Button variant="secondary" leadingIcon={<Save size={16} />}>
          Save as Draft
        </Button>
        <Button variant="primary" leadingIcon={<Check size={16} />}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
