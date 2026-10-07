import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusStyles: Record<
  OrderStatus,
  { fill: string; border: string; textClass?: string }
> = {
  PENDING: {
    fill: "bg-transparent",
    border: "border border-neutral-500",
  },
  CONFIRMED: {
    fill: "bg-neutral-400",
    border: "border border-neutral-400",
  },
  PROCESSING: {
    fill: "bg-transparent",
    border: "border border-accent",
  },
  SHIPPED: {
    fill: "bg-accent",
    border: "border border-accent",
  },
  DELIVERED: {
    fill: "bg-ink",
    border: "border border-ink",
  },
  CANCELLED: {
    fill: "bg-transparent",
    border: "border border-neutral-400",
    textClass: "line-through text-neutral-500",
  },
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export interface StatusMarkerProps {
  status: OrderStatus;
  className?: string;
}

export function StatusMarker({ status, className }: StatusMarkerProps) {
  const style = statusStyles[status];
  return (
    <span className={cn("inline-flex items-center gap-[6px]", className)}>
      <span
        className={cn(
          "block h-[10px] w-[10px] rounded-none",
          style.fill,
          style.border,
        )}
      />
      <span
        className={cn("text-[13px] font-semibold leading-none", style.textClass)}
      >
        {statusLabels[status]}
      </span>
    </span>
  );
}
