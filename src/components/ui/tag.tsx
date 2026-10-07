import { cn } from "@/lib/utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "neutral" | "outline";
}

export function Tag({
  variant = "accent",
  className,
  children,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none px-[10px] py-[3px] text-[11px] font-semibold leading-none",

        variant === "accent" && "bg-accent-100 text-accent-800",
        variant === "neutral" && "bg-neutral-100 text-neutral-800",
        variant === "outline" && "border border-accent text-accent bg-transparent",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
