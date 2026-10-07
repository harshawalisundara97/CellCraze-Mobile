"use client";

import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "color" | "translate"
  > {
  variant?: "default" | "search";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", placeholder, disabled, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        className={className}
        variant="outlined"
        size="small"
        fullWidth
        placeholder={placeholder}
        disabled={disabled}
        slotProps={{
          input: {
            startAdornment:
              variant === "search" ? (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ) : undefined,
          },
          htmlInput: {
            ...props,
          },
        }}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
