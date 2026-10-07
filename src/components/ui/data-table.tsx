"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className,
  emptyMessage = "No data",
}: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} className={className} elevation={0}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography
                  variant="body2"
                  sx={{ py: 2 }}
                >
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow
                key={keyExtractor(row, idx)}
                hover
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={onRowClick ? { cursor: "pointer" } : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.render
                      ? col.render(row, idx)
                      : (row[col.key] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
