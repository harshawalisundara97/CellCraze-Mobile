"use client";

import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  name = "segmented",
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-none border border-divider",
        className,
      )}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              "relative cursor-pointer select-none px-[12px] py-[7px] text-[13px] font-semibold leading-none",
              "transition-colors duration-100",
              isSelected
                ? "bg-accent text-bg"
                : "bg-transparent text-ink hover:bg-ink/[0.05]",
              // divider between options
              "border-r border-divider last:border-r-0",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
