"use client";

import { Package, ShoppingCart, Users, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const stats = [
  { label: "Revenue today", value: formatCurrency(12450000), change: "+12.5%", up: true, icon: TrendingUp },
  { label: "Orders today", value: "23", change: "+8.2%", up: true, icon: ShoppingCart },
  { label: "New customers", value: "5", change: "-2.1%", up: false, icon: Users },
  { label: "Low stock alerts", value: "4", change: "", up: false, icon: AlertTriangle },
];

const recentOrders = [
  { orderNumber: "CC-00015", customer: "Amal Silva", total: 389900, status: "CONFIRMED", date: "2 min ago" },
  { orderNumber: "CC-00014", customer: "Nimali Fernando", total: 179800, status: "PROCESSING", date: "15 min ago" },
  { orderNumber: "CC-00013", customer: "Ruwan Bandara", total: 89900, status: "SHIPPED", date: "1 hour ago" },
  { orderNumber: "CC-00012", customer: "Priya Jayasuriya", total: 449900, status: "DELIVERED", date: "3 hours ago" },
  { orderNumber: "CC-00011", customer: "Kasun Perera", total: 24900, status: "CONFIRMED", date: "5 hours ago" },
];

const lowStockItems = [
  { name: "Galaxy Watch Ultra", sku: "SGW-U7", stock: 3, reorder: 2, category: "Smartwatches" },
  { name: "AirPods Max 2", sku: "APM-2", stock: 5, reorder: 3, category: "Headphones" },
  { name: "Galaxy Buds3 Pro", sku: "SGE-BUDS3P", stock: 0, reorder: 5, category: "Earphones" },
  { name: "Pixel 9 Pro", sku: "PX9P-128", stock: 7, reorder: 3, category: "Phones" },
];

const statusColor: Record<string, string> = {
  CONFIRMED: "bg-blue-500",
  PROCESSING: "bg-yellow-500",
  SHIPPED: "bg-purple-500",
  DELIVERED: "bg-green-600",
  CANCELLED: "bg-neutral-400",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-[32px] mb-1">Dashboard</h1>
      <p className="text-[14px] text-muted mb-8">Overview of your store performance</p>

      <div className="ruled-grid grid-cols-4 max-md:grid-cols-2 rule-bottom mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60">
                  {stat.label}
                </span>
                <Icon size={18} className="text-ink/30" />
              </div>
              <span className="block text-[28px] font-[800] tnum">{stat.value}</span>
              {stat.change && (
                <span className={`inline-flex items-center gap-1 text-[12px] font-semibold mt-1 ${stat.up ? "text-green-600" : "text-accent"}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change} vs yesterday
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_400px] gap-8 max-md:grid-cols-1">
        <div>
          <h2 className="text-[20px] mb-4">Recent orders</h2>
          <div className="border-t-2 border-divider">
            {recentOrders.map((order) => (
              <div key={order.orderNumber} className="flex items-center gap-4 py-3 border-b border-divider text-[14px]">
                <span className="font-[800] tnum w-[100px] shrink-0">{order.orderNumber}</span>
                <span className="flex-1 truncate">{order.customer}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`w-[8px] h-[8px] ${statusColor[order.status] || "bg-neutral-400"}`} />
                  <span className="text-[12px] text-muted capitalize w-[80px]">
                    {order.status.toLowerCase()}
                  </span>
                </div>
                <span className="font-[800] tnum w-[100px] text-right shrink-0">{formatCurrency(order.total)}</span>
                <span className="text-[12px] text-muted w-[80px] text-right shrink-0">{order.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[20px] mb-4">Low stock alerts</h2>
          <div className="border-t-2 border-divider">
            {lowStockItems.map((item) => (
              <div key={item.sku} className="flex items-center gap-3 py-3 border-b border-divider text-[14px]">
                <span className={`w-[8px] h-[8px] shrink-0 ${item.stock === 0 ? "bg-accent" : "bg-yellow-500"}`} />
                <div className="flex-1 min-w-0">
                  <span className="block font-[800] truncate">{item.name}</span>
                  <span className="block text-[12px] text-muted">{item.sku} — {item.category}</span>
                </div>
                <span className={`text-[14px] font-[800] tnum ${item.stock === 0 ? "text-accent" : "text-yellow-600"}`}>
                  {item.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
