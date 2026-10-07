"use client";

import * as React from "react";
import Chip from "@mui/material/Chip";

export interface TagProps {
  variant?: "accent" | "neutral" | "outline";
  className?: string;
  children?: React.ReactNode;
}

export function Tag({
  variant = "accent",
  className,
  children,
  ...props
}: TagProps) {
  const muiVariant = variant === "outline" ? "outlined" : "filled";
  const muiColor = variant === "accent" ? "primary" : "default";

  return (
    <Chip
      label={children}
      variant={muiVariant}
      color={muiColor}
      size="small"
      className={className}
      {...props}
    />
  );
}
