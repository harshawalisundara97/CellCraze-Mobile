"use client";

import { Suspense, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useApi } from "@/hooks/use-api";

interface ApiSupplier {
  id: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  _count: { purchaseOrders: number };
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Company",
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {params.value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {params.row.address}
        </Typography>
      </Box>
    ),
  },
  { field: "contactPerson", headerName: "Contact", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 150 },
  {
    field: "isActive",
    headerName: "Status",
    width: 110,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Chip
        label={params.value ? "Active" : "Inactive"}
        color={params.value ? "success" : "default"}
        size="small"
      />
    ),
  },
  {
    field: "poCount",
    headerName: "POs",
    width: 80,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {params.value}
      </Typography>
    ),
  },
];

export default function AdminSuppliersPage() {
  const [search, setSearch] = useState("");
  const { data } = useApi<ApiSupplier[]>("/api/admin/suppliers");

  const suppliers = (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    contactPerson: s.contactPerson ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    address: s.address ?? "",
    isActive: s.isActive,
    poCount: s._count?.purchaseOrders ?? 0,
  }));

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.contactPerson.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Suppliers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {suppliers.length} suppliers
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Add supplier
        </Button>
      </div>

      <Box sx={{ mb: 3, maxWidth: 320 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search suppliers..."
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
        pageSizeOptions={[10]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        getRowHeight={() => "auto"}
        sx={{
          border: 1,
          borderColor: "divider",
          "& .MuiDataGrid-cell": { py: 1 },
        }}
      />
      </Suspense>
    </Box>
  );
}
