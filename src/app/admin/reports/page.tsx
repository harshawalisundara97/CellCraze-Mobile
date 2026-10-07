"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
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
    <Box>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sales and performance analytics
          </Typography>
        </Box>
        <Tabs value={period} onChange={(_, v) => setPeriod(v)}>
          {periodOptions.map((opt) => (
            <Tab key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Tabs>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3" style={{ marginBottom: 32 }}>
        {[
          { label: "Revenue", value: formatCurrency(totalRevenue) },
          { label: "Profit", value: formatCurrency(profit) },
          { label: "Orders", value: String(totalOrders) },
          { label: "Margin", value: `${margin}%` },
        ].map((stat) => (
          <Card key={stat.label} variant="outlined">
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sales by day
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Revenue</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Orders</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesData.map((day) => (
                  <TableRow key={day.date} hover>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {day.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(day.revenue / 700000) * 100}
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", minWidth: 100, textAlign: "right" }}
                        >
                          {formatCurrency(day.revenue)}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {day.orders}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                        {formatCurrency(day.revenue - day.cost)}
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
            Top products
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: 40 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Sold</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topProducts.map((product, i) => (
                  <TableRow key={product.name} hover>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {i + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {product.sold}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                        {formatCurrency(product.revenue)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Sales by category
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Share</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categorySales.map((cat) => (
                  <TableRow key={cat.category} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cat.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={cat.percentage}
                            color="inherit"
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right" }}
                        >
                          {cat.percentage}%
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                        {formatCurrency(cat.revenue)}
                      </Typography>
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
