"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const suppliers = [
  { id: "s1", name: "DigiWorld Imports" },
  { id: "s2", name: "TechHub Lanka" },
  { id: "s3", name: "MobiTech Distributors" },
];

const products = [
  { id: "p1", name: "iPhone 15 Pro Max 256GB", defaultCost: 389900 },
  { id: "p2", name: "Samsung Galaxy S24 Ultra 512GB", defaultCost: 349900 },
  { id: "p3", name: "Google Pixel 8 Pro 128GB", defaultCost: 219900 },
  { id: "p4", name: "OnePlus 12 256GB", defaultCost: 179900 },
  { id: "p5", name: "Xiaomi 14 Ultra 512GB", defaultCost: 249900 },
  { id: "p6", name: "Nothing Phone (2) 256GB", defaultCost: 134900 },
];

interface LineItem {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
}

let nextLineId = 1;

function createEmptyLine(): LineItem {
  return { id: String(nextLineId++), productId: "", quantity: 1, unitCost: 0 };
}

export default function NewPurchaseOrderPage() {
  const [supplierId, setSupplierId] = useState("");
  const [lines, setLines] = useState<LineItem[]>([createEmptyLine()]);
  const [notes, setNotes] = useState("");

  function updateLine(id: string, field: keyof LineItem, value: string | number) {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        if (field === "productId") {
          const product = products.find((p) => p.id === value);
          return { ...l, productId: value as string, unitCost: product?.defaultCost ?? 0 };
        }
        return { ...l, [field]: value };
      }),
    );
  }

  function removeLine(id: string) {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((l) => l.id !== id)));
  }

  function addLine() {
    setLines((prev) => [...prev, createEmptyLine()]);
  }

  const grandTotal = lines.reduce((sum, l) => sum + l.quantity * l.unitCost, 0);

  return (
    <div>
      <Link
        href="/admin/purchase-orders"
        className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to Purchase Orders
      </Link>

      <h1 className="text-[32px] font-[800] mb-8">New Purchase Order</h1>

      {/* Supplier Selection */}
      <section className="mb-8">
        <h2 className="text-[20px] font-[800] mb-4">Supplier</h2>
        <div className="border-t-2 border-divider pt-4">
          <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-1.5">
            Select Supplier
          </label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="min-h-[36px] w-full max-w-[400px] rounded-none border border-divider bg-surface px-[10px] py-[6px] text-[14px] text-ink focus:border-accent focus:outline-none"
          >
            <option value="">-- Select a supplier --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Items */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-[800]">Items</h2>
          <Button variant="ghost" leadingIcon={<Plus size={16} />} onClick={addLine}>
            Add Item
          </Button>
        </div>

        <div className="border-t-2 border-divider">
          <div className="grid grid-cols-[1fr_80px_120px_120px_36px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
            <span>Product</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Unit Cost</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          {lines.map((line) => (
            <div
              key={line.id}
              className="grid grid-cols-[1fr_80px_120px_120px_36px] gap-4 items-center py-3 border-b border-divider text-[14px]"
            >
              <select
                value={line.productId}
                onChange={(e) => updateLine(line.id, "productId", e.target.value)}
                className="min-h-[36px] w-full rounded-none border border-divider bg-surface px-[10px] py-[6px] text-[14px] text-ink focus:border-accent focus:outline-none"
              >
                <option value="">-- Select product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) => updateLine(line.id, "quantity", parseInt(e.target.value) || 0)}
                className="text-center tnum"
              />

              <Input
                type="number"
                min={0}
                value={line.unitCost}
                onChange={(e) => updateLine(line.id, "unitCost", parseInt(e.target.value) || 0)}
                className="text-right tnum"
              />

              <span className="text-right font-[800] tnum">
                {formatCurrency(line.quantity * line.unitCost)}
              </span>

              <Button
                variant="icon"
                size="icon"
                onClick={() => removeLine(line.id)}
                disabled={lines.length === 1}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}

          {/* Grand Total */}
          <div className="grid grid-cols-[1fr_80px_120px_120px_36px] gap-4 py-4 border-t-2 border-divider">
            <span className="col-span-3 text-right text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60">
              Grand Total
            </span>
            <span className="text-right font-[800] text-[16px] tnum">
              {formatCurrency(grandTotal)}
            </span>
            <span />
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="mb-8">
        <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-1.5">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add any notes for this purchase order..."
          className="w-full rounded-none border border-divider bg-surface px-[10px] py-[8px] text-[14px] text-ink placeholder:text-neutral-500 focus:border-accent focus:outline-none resize-y"
        />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t-2 border-divider pt-6">
        <Button variant="secondary" leadingIcon={<Save size={16} />}>
          Save as Draft
        </Button>
        <Button variant="primary" leadingIcon={<Send size={16} />}>
          Send
        </Button>
      </div>
    </div>
  );
}
