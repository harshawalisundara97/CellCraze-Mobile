"use client";

import * as React from "react";
import MuiButton from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "color" | "translate"
  > {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "default" | "lg" | "icon";
  block?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const sizeMap: Record<string, MuiButtonProps["size"]> = {
  default: "medium",
  lg: "large",
  icon: "medium",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      block = false,
      leadingIcon,
      trailingIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    if (variant === "icon") {
      return (
        <IconButton
          ref={ref}
          className={className}
          disabled={disabled}
          size={sizeMap[size]}
          {...(props as React.ComponentProps<typeof IconButton>)}
        >
          {children}
        </IconButton>
      );
    }

    const muiVariant =
      variant === "primary"
        ? "contained"
        : variant === "secondary"
          ? "outlined"
          : "text";

    const muiColor: MuiButtonProps["color"] =
      variant === "primary"
        ? "primary"
        : variant === "secondary"
          ? "secondary"
          : "primary";

    return (
      <MuiButton
        ref={ref}
        className={className}
        variant={muiVariant}
        color={muiColor}
        size={sizeMap[size]}
        fullWidth={block}
        startIcon={leadingIcon}
        endIcon={trailingIcon}
        disabled={disabled}
        {...(props as React.ComponentProps<typeof MuiButton>)}
      >
        {children}
      </MuiButton>
    );
  },
);

Button.displayName = "Button";

export { Button };
