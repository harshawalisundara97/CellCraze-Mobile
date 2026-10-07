"use client";

import Link from "next/link";
import { Typography, Box } from "@mui/material";

interface LogoProps {
  size?: "default" | "small";
  className?: string;
  dark?: boolean;
}

export function Logo({ size = "default", className, dark }: LogoProps) {
  const fontSize = size === "small" ? 19 : 22;

  return (
    <Link
      href="/"
      style={{ textDecoration: "none" }}
      className={`inline-flex items-center gap-[10px] ${className ?? ""}`}
    >
      <Box
        component="span"
        sx={{
          display: "block",
          width: 14,
          height: 14,
          bgcolor: "primary.main",
        }}
        aria-hidden="true"
      />
      <Typography
        component="span"
        sx={{
          fontWeight: 800,
          fontSize,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: dark ? "#ffffff" : "text.primary",
        }}
      >
        CellCraze
      </Typography>
    </Link>
  );
}
