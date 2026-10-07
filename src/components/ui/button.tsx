"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "default" | "lg" | "icon";
  block?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

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
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // base
          "inline-flex items-center gap-2 rounded-none font-[800] text-[14px] leading-none",
          "transition-colors duration-100 select-none",
          "disabled:pointer-events-none disabled:opacity-[0.45]",

          // variant
          variant === "primary" &&
            "bg-accent text-bg hover:bg-accent-600 active:bg-accent-700",
          variant === "secondary" &&
            "border border-divider bg-transparent text-ink hover:bg-ink/[0.07] active:bg-ink/[0.14]",
          variant === "ghost" &&
            "bg-transparent text-accent hover:bg-accent/[0.10] active:bg-accent/[0.18]",
          variant === "icon" &&
            "justify-center bg-transparent text-ink hover:bg-ink/[0.07] active:bg-ink/[0.14]",

          // size
          size === "default" && "min-h-[36px] px-[14px] py-[8px]",
          size === "lg" && "min-h-[50px] px-[20px] py-[12px] text-[15px]",
          size === "icon" && "h-[36px] w-[36px] p-0 justify-center",

          // block / wide
          block && "w-full justify-between",

          className,
        )}
        {...props}
      >
        {block ? (
          <>
            {leadingIcon}
            <span>{children}</span>
            {trailingIcon && <span className="ml-auto">{trailingIcon}</span>}
          </>
        ) : (
          <>
            {leadingIcon}
            {children}
            {trailingIcon}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
