"use client";

import * as React from "react";
import Chip from "@mui/material/Chip";
import CircleIcon from "@mui/icons-material/Circle";
import type { OrderStatus } from "@/types";

const statusColorMap: Record<
  OrderStatus,
  "warning" | "info" | "primary" | "secondary" | "success" | "error"
> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "primary",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "error",
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export interface StatusMarkerProps {
  status: OrderStatus;
  className?: string;
}

export function StatusMarker({ status, className }: StatusMarkerProps) {
  const color = statusColorMap[status];

  return (
    <Chip
      icon={<CircleIcon sx={{ fontSize: 10 }} />}
      label={statusLabels[status]}
      color={color}
      variant="outlined"
      size="small"
      className={className}
      sx={
        status === "CANCELLED"
          ? { textDecoration: "line-through" }
          : undefined
      }
    />
  );
}
