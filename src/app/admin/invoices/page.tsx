"use client";

import { Suspense, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
];

interface ApiInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  paidAt: string | null;
  order: {
    orderNumber: string;
    user: { name: string | null; email: string | null } | null;
  } | null;
}

interface InvoicesResponse {
  invoices: ApiInvoice[];
  total: number;
  page: number;
  totalPages: number;
}

const statusChipColor: Record<string, "success" | "info" | "error" | "default" | "warning"> = {
  DRAFT: "default",
  SENT: "info",
  PAID: "success",
  OVERDUE: "error",
  CANCELLED: "warning",
};

const columns: GridColDef[] = [
  {
    field: "invoiceNumber",
    headerName: "Invoice",
    width: 160,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "orderNumber",
    headerName: "Order",
    width: 120,
    renderCell: (params) => (
      <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
        {params.value}
      </Typography>
    ),
  },
  { field: "customer", headerName: "Customer", flex: 1, minWidth: 160 },
  {
    field: "status",
    headerName: "Status",
    width: 120,
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
    field: "totalAmount",
    headerName: "Amount",
    width: 150,
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
    width: 200,
    renderCell: (params) => (
      <Typography variant="caption" color="text.secondary">
        {formatDate(params.value)}
      </Typography>
    ),
  },
];

export default function AdminInvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data } = useApi<InvoicesResponse>("/api/admin/invoices");

  const invoices = (data?.invoices ?? []).map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    orderNumber: inv.order?.orderNumber ?? "",
    customer: inv.order?.user?.name ?? "—",
    status: inv.status,
    totalAmount: inv.totalAmount,
    createdAt: inv.createdAt,
    paidAt: inv.paidAt,
  }));

  const filtered = invoices.filter((inv) => statusFilter === "all" || inv.status === statusFilter);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        Invoices
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {invoices.length} invoices
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={statusFilter}
          onChange={(_, v) => setStatusFilter(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {statusOptions.map((opt) => (
            <Tab key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Tabs>
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
          }}
        />
      </Suspense>
    </Box>
  );
}
