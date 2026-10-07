"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  ShoppingCart,
  People,
  Warning,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";

interface DashboardStats {
  revenueToday: number;
  ordersToday: number;
  newCustomers: number;
  outOfStock: number;
  lowStock: number;
}

interface RecentOrderApi {
  id: string;
  orderNumber: string;
  totalAmount: string | number;
  status: string;
  createdAt: string;
  user: { name: string | null } | null;
}

interface LowStockApi {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  reorderPoint: number;
  category: { name: string } | null;
}

const statusChipColor: Record<string, "info" | "warning" | "secondary" | "success" | "default"> = {
  CONFIRMED: "info",
  PROCESSING: "warning",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "default",
};

export default function AdminDashboardPage() {
  const { data: statsData } = useApi<DashboardStats>("/api/admin/dashboard/stats");
  const { data: recentData } = useApi<RecentOrderApi[]>("/api/admin/dashboard/recent-orders");
  const { data: lowStockData } = useApi<LowStockApi[]>("/api/admin/inventory/low-stock");

  const stats = [
    { label: "Revenue today", value: formatCurrency(statsData?.revenueToday ?? 0), change: "", up: true, icon: TrendingUp },
    { label: "Orders today", value: String(statsData?.ordersToday ?? 0), change: "", up: true, icon: ShoppingCart },
    { label: "New customers", value: String(statsData?.newCustomers ?? 0), change: "", up: true, icon: People },
    { label: "Low stock alerts", value: String(statsData?.lowStock ?? 0), change: "", up: false, icon: Warning },
  ];

  const recentOrders = (recentData ?? []).map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customer: o.user?.name ?? "—",
    total: o.totalAmount,
    status: o.status,
    date: formatDate(o.createdAt),
  }));

  const lowStockItems = (lowStockData ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    stock: p.stockQuantity,
    reorder: p.reorderPoint,
    category: p.category?.name ?? "",
  }));

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Overview of your store performance
      </Typography>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3" style={{ marginBottom: 32 }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="outlined">
              <CardContent>
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <Typography variant="overline" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Icon sx={{ fontSize: 20, color: "text.disabled" }} />
                </div>
                <Typography variant="h4" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                  {stat.value}
                </Typography>
                {stat.change && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    {stat.up ? (
                      <ArrowUpward sx={{ fontSize: 14, color: "success.main" }} />
                    ) : (
                      <ArrowDownward sx={{ fontSize: 14, color: "error.main" }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: stat.up ? "success.main" : "error.main" }}
                    >
                      {stat.change} vs yesterday
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_400px] gap-8 max-md:grid-cols-1">
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent orders
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.orderNumber} hover>
                    <TableCell sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.toLowerCase()}
                        color={statusChipColor[order.status] || "default"}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {order.date}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Low stock alerts
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.sku} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={item.stock}
                        color={item.stock === 0 ? "error" : "warning"}
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </Box>
  );
}
