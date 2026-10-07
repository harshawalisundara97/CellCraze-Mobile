"use client";

import * as React from "react";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

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
  className,
}: SegmentedControlProps) {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      className={className}
      size="small"
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
