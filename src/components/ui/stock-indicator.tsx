"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircleIcon from "@mui/icons-material/Circle";

export interface StockIndicatorProps {
  quantity: number;
  className?: string;
}

export function StockIndicator({ quantity, className }: StockIndicatorProps) {
  let label: string;
  let color: string;

  if (quantity === 0) {
    label = "Out of stock";
    color = "text.disabled";
  } else if (quantity <= 5) {
    label = `Only ${quantity} left`;
    color = "primary.main";
  } else {
    label = "In stock";
    color = "text.primary";
  }

  return (
    <Box
      component="span"
      className={className}
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}
    >
      <CircleIcon sx={{ fontSize: 8, color }} />
      <Typography
        variant="body2"
        component="span"
        sx={{ fontSize: "0.75rem", fontWeight: 600, lineHeight: 1 }}
      >
        {label}
      </Typography>
    </Box>
  );
}
