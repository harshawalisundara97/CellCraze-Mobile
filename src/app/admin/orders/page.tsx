"use client";

import { Suspense, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";

const statusOptions = ["all", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
const statusLabels: Record<string, string> = {
  all: "All",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  user: { name: string | null; email: string | null } | null;
  items: { id: string }[];
}

interface OrdersResponse {
  orders: ApiOrder[];
  total: number;
  page: number;
  totalPages: number;
}

const statusChipColor: Record<string, "info" | "warning" | "secondary" | "success" | "default" | "error"> = {
  CONFIRMED: "info",
  PROCESSING: "warning",
  SHIPPED: "secondary",
  DELIVERED: "success",
  PENDING: "default",
  CANCELLED: "error",
};

const columns: GridColDef[] = [
  {
    field: "orderNumber",
    headerName: "Order",
    width: 120,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "customer",
    headerName: "Customer",
    flex: 1,
    minWidth: 180,
    renderCell: (params) => (
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {params.row.email}
        </Typography>
      </Box>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <Chip
        label={params.value.toLowerCase()}
        color={statusChipColor[params.value] || "default"}
        size="small"
        sx={{ textTransform: "capitalize" }}
      />
    ),
  },
  {
    field: "itemCount",
    headerName: "Items",
    width: 80,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "totalAmount",
    headerName: "Total",
    width: 140,
    align: "right",
    headerAlign: "right",
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {formatCurrency(params.value)}
      </Typography>
    ),
  },
  {
    field: "createdAt",
    headerName: "Date",
    width: 180,
    renderCell: (params) => (
      <Typography variant="caption" color="text.secondary">
        {formatDate(params.value)}
      </Typography>
    ),
  },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { data } = useApi<OrdersResponse>("/api/admin/orders");

  const orders = (data?.orders ?? []).map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customer: o.user?.name ?? "—",
    email: o.user?.email ?? "",
    status: o.status,
    totalAmount: o.totalAmount,
    itemCount: o.items?.length ?? 0,
    createdAt: o.createdAt,
  }));

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search && !o.orderNumber.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {orders.length} total orders
      </Typography>

      <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4" style={{ marginBottom: 24 }}>
        <Tabs
          value={statusFilter}
          onChange={(_, v) => setStatusFilter(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {statusOptions.map((opt) => (
            <Tab key={opt} label={statusLabels[opt]} value={opt} />
          ))}
        </Tabs>
        <Box sx={{ width: 260 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search orders..."
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
