"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "search";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", ...props }, ref) => {
    if (variant === "search") {
      return (
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            ref={ref}
            className={cn(
              "min-h-[36px] w-full rounded-none border border-divider bg-surface",
              "pl-[34px] pr-[10px] py-[6px] text-[14px] text-ink",
              "font-sans placeholder:text-neutral-500",
              "transition-colors duration-100",
              "hover:border-ink/[0.45] focus:border-accent focus:outline-none",
              className,
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          "min-h-[36px] w-full rounded-none border border-divider bg-surface",
          "px-[10px] py-[6px] text-[14px] text-ink",
          "font-sans placeholder:text-neutral-500",
          "transition-colors duration-100",
          "hover:border-ink/[0.45] focus:border-accent focus:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
