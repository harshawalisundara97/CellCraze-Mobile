"use client";

import { Suspense, useMemo, useState } from "react";
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
import { useApi } from "@/hooks/use-api";

const periodOptions = [
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
];

interface SalesReport {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  totalOrders: number;
  averageOrderValue: number;
}

interface TopProductApi {
  productId: string;
  name: string;
  sku: string;
  unitsSold: number;
  revenue: number;
}

interface CategorySaleApi {
  name: string;
  total: number;
  percentage: number;
}

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 4 }}><Typography color="text.secondary">Loading reports...</Typography></Box>}>
      <ReportsContent />
    </Suspense>
  );
}

function ReportsContent() {
  const [period, setPeriod] = useState("30");

  const salesUrl = useMemo(() => {
    const end = new Date();
    const start = new Date(Date.now() - Number(period) * 86400000);
    return `/api/admin/reports/sales?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
  }, [period]);

  const { data: salesReport } = useApi<SalesReport>(salesUrl);
  const { data: topData } = useApi<TopProductApi[]>("/api/admin/reports/top-products");
  const { data: catData } = useApi<CategorySaleApi[]>("/api/admin/reports/category-sales");

  // reports/sales returns an aggregate (not per-day rows); it drives the KPI cards.
  const totalRevenue = salesReport?.totalRevenue ?? 0;
  const profit = salesReport?.grossProfit ?? 0;
  const totalOrders = salesReport?.totalOrders ?? 0;
  const margin = salesReport?.profitMargin ?? 0;

  // No per-day endpoint among the three report routes, so the daily table has no source.
  const salesData: { date: string; revenue: number; orders: number; cost: number }[] = [];

  const topProducts = (topData ?? []).map((p) => ({
    name: p.name,
    sold: p.unitsSold,
    revenue: p.revenue,
  }));

  const categorySales = (catData ?? []).map((c) => ({
    category: c.name,
    revenue: c.total,
    percentage: c.percentage,
  }));

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
