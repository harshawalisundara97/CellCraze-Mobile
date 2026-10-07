"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { formatCurrency } from "@/lib/utils";

const periodOptions = [
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
];

const salesData = [
  { date: "Dec 14", revenue: 389900, orders: 2, cost: 320000 },
  { date: "Dec 15", revenue: 569700, orders: 3, cost: 445000 },
  { date: "Dec 16", revenue: 179800, orders: 1, cost: 122000 },
  { date: "Dec 17", revenue: 449900, orders: 2, cost: 348000 },
  { date: "Dec 18", revenue: 89900, orders: 1, cost: 62000 },
  { date: "Dec 19", revenue: 639800, orders: 4, cost: 502000 },
  { date: "Dec 20", revenue: 389900, orders: 2, cost: 320000 },
];

const topProducts = [
  { name: "Galaxy S25 Ultra", sold: 28, revenue: 10917200 },
  { name: "iPhone 16 Pro", sold: 22, revenue: 9897800 },
  { name: "Sony WH-1000XM5", sold: 18, revenue: 1618200 },
  { name: "AirPods Pro 3", sold: 15, revenue: 1198500 },
  { name: "Anker 737 Power Bank", sold: 12, revenue: 418800 },
];

const categorySales = [
  { category: "Phones", revenue: 24500000, percentage: 62 },
  { category: "Headphones", revenue: 4200000, percentage: 11 },
  { category: "Earphones", revenue: 3800000, percentage: 10 },
  { category: "Chargers", revenue: 2100000, percentage: 5 },
  { category: "Smartwatches", revenue: 3500000, percentage: 9 },
  { category: "Accessories", revenue: 1200000, percentage: 3 },
];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState("30");

  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalCost = salesData.reduce((s, d) => s + d.cost, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0);
  const profit = totalRevenue - totalCost;
  const margin = Math.round((profit / totalRevenue) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px]">Reports</h1>
          <p className="text-[14px] text-muted">Sales and performance analytics</p>
        </div>
        <SegmentedControl options={periodOptions} value={period} onChange={setPeriod} name="period" />
      </div>

      <div className="ruled-grid grid-cols-4 max-md:grid-cols-2 rule-bottom mb-8">
        {[
          { label: "Revenue", value: formatCurrency(totalRevenue) },
          { label: "Profit", value: formatCurrency(profit) },
          { label: "Orders", value: String(totalOrders) },
          { label: "Margin", value: `${margin}%` },
        ].map((stat) => (
          <div key={stat.label} className="px-6 py-5">
            <span className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
              {stat.label}
            </span>
            <span className="block text-[28px] font-[800] tnum">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
        <div>
          <h2 className="text-[20px] mb-4">Sales by day</h2>
          <div className="border-t-2 border-divider">
            <div className="grid grid-cols-[80px_1fr_60px_100px] gap-4 py-2 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b border-divider">
              <span>Date</span>
              <span>Revenue</span>
              <span className="text-center">Orders</span>
              <span className="text-right">Profit</span>
            </div>
            {salesData.map((day) => (
              <div key={day.date} className="grid grid-cols-[80px_1fr_60px_100px] gap-4 items-center py-2 border-b border-divider text-[14px]">
                <span className="text-muted">{day.date}</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[8px] bg-surface">
                    <div className="h-full bg-accent" style={{ width: `${(day.revenue / 700000) * 100}%` }} />
                  </div>
                  <span className="tnum font-semibold w-[100px] text-right">{formatCurrency(day.revenue)}</span>
                </div>
                <span className="text-center tnum">{day.orders}</span>
                <span className="text-right tnum font-semibold">{formatCurrency(day.revenue - day.cost)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[20px] mb-4">Top products</h2>
          <div className="border-t-2 border-divider">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3 py-3 border-b border-divider text-[14px]">
                <span className="text-[12px] tnum text-ink/50 w-[24px]">{i + 1}</span>
                <span className="flex-1 font-[800] truncate">{product.name}</span>
                <span className="text-[12px] text-muted tnum">{product.sold} sold</span>
                <span className="font-[800] tnum w-[120px] text-right">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>

          <h2 className="text-[20px] mt-8 mb-4">Sales by category</h2>
          <div className="border-t-2 border-divider">
            {categorySales.map((cat) => (
              <div key={cat.category} className="flex items-center gap-3 py-3 border-b border-divider text-[14px]">
                <span className="w-[120px] font-semibold">{cat.category}</span>
                <div className="flex-1 h-[8px] bg-surface">
                  <div className="h-full bg-ink" style={{ width: `${cat.percentage}%` }} />
                </div>
                <span className="tnum text-muted w-[40px] text-right">{cat.percentage}%</span>
                <span className="font-[800] tnum w-[120px] text-right">{formatCurrency(cat.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
