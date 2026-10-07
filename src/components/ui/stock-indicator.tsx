import { cn } from "@/lib/utils";

export interface StockIndicatorProps {
  quantity: number;
  className?: string;
}

export function StockIndicator({ quantity, className }: StockIndicatorProps) {
  let label: string;
  let colorClass: string;

  if (quantity === 0) {
    label = "Out of stock";
    colorClass = "bg-neutral-400";
  } else if (quantity <= 5) {
    label = `Only ${quantity} left`;
    colorClass = "bg-accent";
  } else {
    label = "In stock";
    colorClass = "bg-ink";
  }

  return (
    <span className={cn("inline-flex items-center gap-[6px]", className)}>
      <span className={cn("block h-[8px] w-[8px] rounded-none", colorClass)} />
      <span className="text-[12px] font-semibold leading-none">{label}</span>
    </span>
  );
}
