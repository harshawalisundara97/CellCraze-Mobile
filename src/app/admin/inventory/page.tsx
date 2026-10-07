"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { StockIndicator } from "@/components/ui/stock-indicator";
import { formatCurrency } from "@/lib/utils";

const viewOptions = [
  { label: "All", value: "all" },
  { label: "Low stock", value: "low" },
  { label: "Out of stock", value: "out" },
];

const inventory = [
  { id: "1", sku: "SM-S938B-256", name: "Galaxy S25 Ultra", category: "Phones", stockQuantity: 12, reorderPoint: 5, costPrice: 320000, value: 3840000 },
  { id: "2", sku: "IP16P-256", name: "iPhone 16 Pro", category: "Phones", stockQuantity: 15, reorderPoint: 5, costPrice: 380000, value: 5700000 },
  { id: "3", sku: "SONY-WH1000XM5", name: "Sony WH-1000XM5", category: "Headphones", stockQuantity: 18, reorderPoint: 5, costPrice: 62000, value: 1116000 },
  { id: "4", sku: "SGE-BUDS3P", name: "Galaxy Buds3 Pro", category: "Earphones", stockQuantity: 0, reorderPoint: 5, costPrice: 40000, value: 0 },
  { id: "5", sku: "SGW-U7", name: "Galaxy Watch Ultra", category: "Smartwatches", stockQuantity: 3, reorderPoint: 2, costPrice: 115000, value: 345000 },
  { id: "6", sku: "APM-2", name: "AirPods Max 2", category: "Headphones", stockQuantity: 5, reorderPoint: 3, costPrice: 110000, value: 550000 },
  { id: "7", sku: "USBC-2M", name: "Anker USB-C Cable 2m", category: "Accessories", stockQuantity: 100, reorderPoint: 30, costPrice: 1200, value: 120000 },
  { id: "8", sku: "SPG-ULTRA", name: "Spigen Ultra Hybrid Case", category: "Accessories", stockQuantity: 50, reorderPoint: 20, costPrice: 2000, value: 100000 },
];

export default function AdminInventoryPage() {
  const [view, setView] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = inventory.filter((item) => {
    if (view === "low" && item.stockQuantity > item.reorderPoint) return false;
    if (view === "out" && item.stockQuantity > 0) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = inventory.reduce((s, i) => s + i.value, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[32px]">Inventory</h1>
        <div className="text-right">
          <span className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60">Total stock value</span>
          <span className="block text-[24px] font-[800] tnum">{formatCurrency(totalValue)}</span>
        </div>
      </div>
      <p className="text-[14px] text-muted mb-6">{inventory.length} products tracked</p>

      <div className="flex items-center justify-between mb-6 max-md:flex-col max-md:items-start max-md:gap-4">
        <SegmentedControl options={viewOptions} value={view} onChange={setView} name="view" />
        <div className="w-[260px]">
          <Input variant="search" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="border-t-2 border-divider">
        <div className="grid grid-cols-[100px_1fr_100px_80px_80px_120px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
          <span>SKU</span>
          <span>Product</span>
          <span>Category</span>
          <span className="text-center">Stock</span>
          <span className="text-center">Reorder</span>
          <span className="text-right">Value</span>
        </div>
        {filtered.map((item) => (
          <div key={item.id} className="grid grid-cols-[100px_1fr_100px_80px_80px_120px] gap-4 items-center py-3 border-b border-divider text-[14px]">
            <span className="tnum text-muted">{item.sku}</span>
            <span className="font-[800] truncate">{item.name}</span>
            <span className="text-muted">{item.category}</span>
            <span className="flex items-center justify-center gap-2">
              <StockIndicator quantity={item.stockQuantity} />
              <span className="tnum">{item.stockQuantity}</span>
            </span>
            <span className="text-center tnum text-muted">{item.reorderPoint}</span>
            <span className="text-right tnum font-semibold">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
