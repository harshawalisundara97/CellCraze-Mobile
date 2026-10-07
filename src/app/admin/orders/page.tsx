"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StatusMarker } from "@/components/ui/status-marker";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
];

const orders = [
  { id: "1", orderNumber: "CC-00015", customer: "Amal Silva", email: "amal@example.com", status: "CONFIRMED", totalAmount: 389900, itemCount: 1, createdAt: "2024-12-20T10:30:00Z" },
  { id: "2", orderNumber: "CC-00014", customer: "Nimali Fernando", email: "nimali@example.com", status: "PROCESSING", totalAmount: 179800, itemCount: 2, createdAt: "2024-12-19T14:20:00Z" },
  { id: "3", orderNumber: "CC-00013", customer: "Ruwan Bandara", email: "ruwan@example.com", status: "SHIPPED", totalAmount: 89900, itemCount: 1, createdAt: "2024-12-18T09:15:00Z" },
  { id: "4", orderNumber: "CC-00012", customer: "Priya Jayasuriya", email: "priya@example.com", status: "DELIVERED", totalAmount: 569700, itemCount: 3, createdAt: "2024-12-15T10:30:00Z" },
  { id: "5", orderNumber: "CC-00011", customer: "Kasun Perera", email: "kasun@example.com", status: "PENDING", totalAmount: 24900, itemCount: 1, createdAt: "2024-12-14T16:45:00Z" },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search && !o.orderNumber.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-[32px] mb-1">Orders</h1>
      <p className="text-[14px] text-muted mb-6">{orders.length} total orders</p>

      <div className="flex items-center justify-between mb-6 max-md:flex-col max-md:items-start max-md:gap-4">
        <SegmentedControl options={statusOptions} value={statusFilter} onChange={setStatusFilter} name="status" />
        <div className="w-[260px]">
          <Input variant="search" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="border-t-2 border-divider">
        <div className="grid grid-cols-[110px_1fr_100px_80px_120px_120px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
          <span>Order</span>
          <span>Customer</span>
          <span>Status</span>
          <span className="text-center">Items</span>
          <span className="text-right">Total</span>
          <span className="text-right">Date</span>
        </div>
        {filtered.map((order) => (
          <div key={order.id} className="grid grid-cols-[110px_1fr_100px_80px_120px_120px] gap-4 items-center py-3 border-b border-divider text-[14px] hover:bg-ink/[0.02] cursor-pointer transition-colors">
            <span className="font-[800] tnum">{order.orderNumber}</span>
            <div>
              <span className="block font-semibold truncate">{order.customer}</span>
              <span className="block text-[12px] text-muted">{order.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusMarker status={order.status as any} />
              <span className="text-[12px] capitalize">{order.status.toLowerCase()}</span>
            </div>
            <span className="text-center tnum text-muted">{order.itemCount}</span>
            <span className="text-right font-[800] tnum">{formatCurrency(order.totalAmount)}</span>
            <span className="text-right text-[12px] text-muted">{formatDate(order.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
