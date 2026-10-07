"use client";

import { Suspense, useState } from "react";
import { Box, Typography, Button, TextField, Chip, InputAdornment } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { formatCurrency } from "@/lib/utils";

const products = [
  { id: "1", sku: "SM-S938B-256", name: "Galaxy S25 Ultra", brand: "Samsung", category: "Phones", price: 389900, stockQuantity: 12, isActive: true, isFeatured: true },
  { id: "2", sku: "IP16P-256", name: "iPhone 16 Pro", brand: "Apple", category: "Phones", price: 449900, stockQuantity: 15, isActive: true, isFeatured: true },
  { id: "3", sku: "SONY-WH1000XM5", name: "Sony WH-1000XM5", brand: "Sony", category: "Headphones", price: 89900, stockQuantity: 18, isActive: true, isFeatured: true },
  { id: "4", sku: "SGE-BUDS3P", name: "Galaxy Buds3 Pro", brand: "Samsung", category: "Earphones", price: 59900, stockQuantity: 0, isActive: true, isFeatured: false },
  { id: "5", sku: "ANK-737", name: "Anker 737 Power Bank", brand: "Anker", category: "Chargers", price: 34900, stockQuantity: 25, isActive: true, isFeatured: true },
  { id: "6", sku: "AW-S10", name: "Apple Watch Series 10", brand: "Apple", category: "Smartwatches", price: 129900, stockQuantity: 10, isActive: true, isFeatured: true },
  { id: "7", sku: "SGW-U7", name: "Galaxy Watch Ultra", brand: "Samsung", category: "Smartwatches", price: 159900, stockQuantity: 3, isActive: true, isFeatured: false },
  { id: "8", sku: "SPG-ULTRA", name: "Spigen Ultra Hybrid Case", brand: "Spigen", category: "Accessories", price: 4900, stockQuantity: 50, isActive: true, isFeatured: false },
];

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
