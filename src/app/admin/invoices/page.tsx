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

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
];

const invoices = [
  { id: "1", invoiceNumber: "INV-2024-0012", orderNumber: "CC-00012", customer: "Nimali Fernando", status: "PAID", totalAmount: 569700, createdAt: "2024-12-18T10:00:00Z", paidAt: "2024-12-18T10:32:00Z" },
  { id: "2", invoiceNumber: "INV-2024-0011", orderNumber: "CC-00011", customer: "Kasun Perera", status: "SENT", totalAmount: 24900, createdAt: "2024-12-14T16:00:00Z", paidAt: null },
  { id: "3", invoiceNumber: "INV-2024-0010", orderNumber: "CC-00010", customer: "Amal Silva", status: "OVERDUE", totalAmount: 179800, createdAt: "2024-12-08T09:00:00Z", paidAt: null },
  { id: "4", invoiceNumber: "INV-2024-0009", orderNumber: "CC-00009", customer: "Priya Jayasuriya", status: "PAID", totalAmount: 449900, createdAt: "2024-12-05T14:00:00Z", paidAt: "2024-12-06T11:00:00Z" },
];

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
