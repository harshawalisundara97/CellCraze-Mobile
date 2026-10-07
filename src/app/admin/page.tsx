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
import { formatCurrency } from "@/lib/utils";

const stats = [
  { label: "Revenue today", value: formatCurrency(12450000), change: "+12.5%", up: true, icon: TrendingUp },
  { label: "Orders today", value: "23", change: "+8.2%", up: true, icon: ShoppingCart },
  { label: "New customers", value: "5", change: "-2.1%", up: false, icon: People },
  { label: "Low stock alerts", value: "4", change: "", up: false, icon: Warning },
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

const statusChipColor: Record<string, "info" | "warning" | "secondary" | "success" | "default"> = {
  CONFIRMED: "info",
  PROCESSING: "warning",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "default",
};

export default function AdminDashboardPage() {
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
