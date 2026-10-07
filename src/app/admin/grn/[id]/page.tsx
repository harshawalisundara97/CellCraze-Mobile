"use client";

import { useState } from "react";
import Link from "next/link";

const mockGRN = {
  id: "grn-1",
  grnNumber: "GRN-2024-0005",
  status: "DRAFT" as const,
  receivedDate: "2024-03-15",
  createdAt: "2024-03-15T10:30:00Z",
  notes: "Partial shipment received. Remaining items expected next week.",
  purchaseOrder: {
    id: "po-1",
    poNumber: "PO-2024-0007",
  },
  supplier: {
    id: "sup-1",
    name: "DigiWorld Imports",
    contactPerson: "Kamal Perera",
    email: "kamal@digiworld.lk",
    phone: "+94 77 234 5678",
  },
  createdBy: {
    name: "Harsha Sundara",
  },
  items: [
    {
      id: "gi-1",
      product: { name: "USB-C Fast Charger 25W", sku: "CHG-USB25W" },
      poItem: { quantity: 50, unitCost: 145000 },
      receivedQty: 50,
      rejectedQty: 2,
      notes: "2 units with damaged packaging",
    },
    {
      id: "gi-2",
      product: { name: "Wireless Earbuds Pro", sku: "AUD-WLPRO" },
      poItem: { quantity: 30, unitCost: 389900 },
      receivedQty: 20,
      rejectedQty: 0,
      notes: "Remaining 10 units in next shipment",
    },
  ],
};

function formatCurrency(cents: number): string {
  return `Rs ${(cents / 100).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: "bg-neutral-200 text-neutral-700",
    CONFIRMED: "bg-green-100 text-green-800",
  };
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider ${colors[status] || "bg-neutral-100 text-neutral-600"}`}>
      {status}
    </span>
  );
}

export default function GRNDetailPage() {
  const [grn] = useState(mockGRN);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => setConfirming(false), 1500);
  };

  const totalReceived = grn.items.reduce((sum, i) => sum + i.receivedQty, 0);
  const totalRejected = grn.items.reduce((sum, i) => sum + i.rejectedQty, 0);
  const totalValue = grn.items.reduce((sum, i) => sum + i.receivedQty * i.poItem.unitCost, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/grn" className="text-sm text-neutral-500 hover:text-[#ec3013]">
              ← Back to GRNs
            </Link>
          </div>
          <h1 className="text-2xl font-[800] uppercase tracking-tight">{grn.grnNumber}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Received {new Date(grn.receivedDate).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}
            {" · "}Created by {grn.createdBy.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={grn.status} />
          {grn.status === "DRAFT" && (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="bg-[#ec3013] text-white px-5 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-red-700 disabled:opacity-50"
            >
              {confirming ? "Confirming…" : "Confirm GRN"}
            </button>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-neutral-900 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Purchase Order</h3>
          <Link href={`/admin/purchase-orders/${grn.purchaseOrder.id}`} className="text-sm font-semibold hover:text-[#ec3013]">
            {grn.purchaseOrder.poNumber}
          </Link>
        </div>
        <div className="border-2 border-neutral-900 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Supplier</h3>
          <p className="text-sm font-semibold">{grn.supplier.name}</p>
          <p className="text-xs text-neutral-500 mt-1">{grn.supplier.contactPerson} · {grn.supplier.phone}</p>
        </div>
        <div className="border-2 border-neutral-900 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Summary</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-neutral-500 text-xs">Received</span>
              <p className="font-semibold">{totalReceived}</p>
            </div>
            <div>
              <span className="text-neutral-500 text-xs">Rejected</span>
              <p className="font-semibold text-[#ec3013]">{totalRejected}</p>
            </div>
            <div>
              <span className="text-neutral-500 text-xs">Value</span>
              <p className="font-semibold">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {grn.notes && (
        <div className="border-2 border-neutral-900 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Notes</h3>
          <p className="text-sm text-neutral-700">{grn.notes}</p>
        </div>
      )}

      {/* Items Table */}
      <div className="border-2 border-neutral-900">
        <div className="p-5 border-b-2 border-neutral-900">
          <h3 className="text-sm font-[800] uppercase tracking-wider">Received Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-900 bg-neutral-50">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Product</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">SKU</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Ordered</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Received</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Rejected</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Unit Cost</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Line Total</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Notes</th>
              </tr>
            </thead>
            <tbody>
              {grn.items.map((item) => (
                <tr key={item.id} className="border-b border-neutral-200">
                  <td className="p-4 font-semibold">{item.product.name}</td>
                  <td className="p-4 text-neutral-500 font-mono text-xs">{item.product.sku}</td>
                  <td className="p-4 text-right">{item.poItem.quantity}</td>
                  <td className="p-4 text-right font-semibold">{item.receivedQty}</td>
                  <td className="p-4 text-right text-[#ec3013] font-semibold">{item.rejectedQty || "—"}</td>
                  <td className="p-4 text-right">{formatCurrency(item.poItem.unitCost)}</td>
                  <td className="p-4 text-right font-semibold">{formatCurrency(item.receivedQty * item.poItem.unitCost)}</td>
                  <td className="p-4 text-neutral-500 text-xs max-w-[200px]">{item.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-900 bg-neutral-50">
                <td colSpan={3} className="p-4 font-[800] uppercase text-xs tracking-wider">Total</td>
                <td className="p-4 text-right font-[800]">{totalReceived}</td>
                <td className="p-4 text-right font-[800] text-[#ec3013]">{totalRejected}</td>
                <td className="p-4"></td>
                <td className="p-4 text-right font-[800]">{formatCurrency(totalValue)}</td>
                <td className="p-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
