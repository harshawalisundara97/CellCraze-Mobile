"use client";

import { Suspense, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import { Search, Inventory2, WarningAmber, ErrorOutlined } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { formatCurrency } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";

const viewOptions = [
  { label: "All", value: "all" },
  { label: "Low stock", value: "low" },
  { label: "Out of stock", value: "out" },
];

interface ApiInventoryProduct {
  id: string;
  sku: string;
  name: string;
  stockQuantity: number;
  reorderPoint: number;
  reorderQty: number;
  costPrice: string | number;
  price: string | number;
  category: { name: string } | null;
}

interface InventoryResponse {
  products: ApiInventoryProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const columns: GridColDef[] = [
  { field: "sku", headerName: "SKU", width: 140 },
  { field: "name", headerName: "Product", flex: 1, minWidth: 180 },
  { field: "category", headerName: "Category", width: 120 },
  {
    field: "stockQuantity",
    headerName: "Stock",
    width: 110,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={params.value === 0 ? "error" : params.value <= params.row.reorderPoint ? "warning" : "success"}
        sx={{ fontWeight: 700, minWidth: 40 }}
      />
    ),
  },
  {
    field: "reorderPoint",
    headerName: "Reorder Pt",
    width: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "value",
    headerName: "Value",
    width: 140,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
        {formatCurrency(params.value)}
      </Typography>
    ),
  },
];

export default function AdminInventoryPage() {
  const [view, setView] = useState("all");
  const [search, setSearch] = useState("");
  const { data } = useApi<InventoryResponse>("/api/admin/inventory");

  const inventory = (data?.products ?? []).map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category?.name ?? "",
    stockQuantity: p.stockQuantity,
    reorderPoint: p.reorderPoint,
    costPrice: Number(p.costPrice),
    value: Number(p.costPrice) * p.stockQuantity,
  }));

  const totalValue = inventory.reduce((s, i) => s + i.value, 0);
  const totalItems = inventory.reduce((s, i) => s + i.stockQuantity, 0);
  const lowStockCount = inventory.filter((i) => i.stockQuantity > 0 && i.stockQuantity <= i.reorderPoint).length;
  const outOfStockCount = inventory.filter((i) => i.stockQuantity === 0).length;

  const filtered = inventory.filter((item) => {
    if (view === "low" && item.stockQuantity > item.reorderPoint) return false;
    if (view === "out" && item.stockQuantity > 0) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        Inventory
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {inventory.length} products tracked
      </Typography>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3" style={{ marginBottom: 24 }}>
        <Card variant="outlined">
          <CardContent>
            <div className="flex items-center justify-between">
              <Typography variant="overline" color="text.secondary">Total stock value</Typography>
              <Inventory2 sx={{ fontSize: 20, color: "text.disabled" }} />
            </div>
            <Typography variant="h5" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(totalValue)}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="overline" color="text.secondary">Total units</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
              {totalItems}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <div className="flex items-center justify-between">
              <Typography variant="overline" color="text.secondary">Low stock</Typography>
              <WarningAmber sx={{ fontSize: 20, color: "warning.main" }} />
            </div>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {lowStockCount}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <div className="flex items-center justify-between">
              <Typography variant="overline" color="text.secondary">Out of stock</Typography>
              <ErrorOutlined sx={{ fontSize: 20, color: "error.main" }} />
            </div>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {outOfStockCount}
            </Typography>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4" style={{ marginBottom: 24 }}>
        <Tabs value={view} onChange={(_, v) => setView(v)}>
          {viewOptions.map((opt) => (
            <Tab key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Tabs>
        <Box sx={{ width: 260 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </div>

      <Suspense fallback={<Box sx={{ height: 400 }} />}>
        <DataGrid
        rows={filtered}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{
          border: 1,
          borderColor: "divider",
        }}
      />
      </Suspense>
    </Box>
  );
}
