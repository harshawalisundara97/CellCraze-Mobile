"use client";

import { Suspense, useState } from "react";
import { Box, Typography, Button, TextField, Chip, InputAdornment } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { formatCurrency } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";

interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  price: string | number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string; slug: string } | null;
}

interface ProductsResponse {
  products: ApiProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const columns: GridColDef[] = [
  { field: "sku", headerName: "SKU", width: 140 },
  { field: "name", headerName: "Product", flex: 1, minWidth: 180 },
  { field: "category", headerName: "Category", width: 120 },
  { field: "brand", headerName: "Brand", width: 110 },
  {
    field: "price",
    headerName: "Price",
    width: 130,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {formatCurrency(params.value)}
      </Typography>
    ),
  },
  {
    field: "stockQuantity",
    headerName: "Stock",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={params.value === 0 ? "error" : params.value <= 5 ? "warning" : "success"}
        sx={{ fontWeight: 700, minWidth: 40 }}
      />
    ),
  },
  {
    field: "isFeatured",
    headerName: "Status",
    width: 110,
    align: "center",
    headerAlign: "center",
    renderCell: (params) =>
      params.value ? <Chip label="Featured" color="info" size="small" /> : null,
  },
];

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const { data } = useApi<ProductsResponse>("/api/admin/products");

  const products = (data?.products ?? []).map((p) => ({
    ...p,
    category: p.category?.name ?? "",
  }));

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {products.length} products
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Add product
        </Button>
      </div>

      <Box sx={{ mb: 3, maxWidth: 320 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search products..."
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
          "& .MuiDataGrid-columnHeaders": { fontWeight: 700 },
        }}
      />
      </Suspense>
    </Box>
  );
}
