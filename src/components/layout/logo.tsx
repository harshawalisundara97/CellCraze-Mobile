import Link from "next/link";

interface LogoProps {
  size?: "default" | "small";
  className?: string;
}

export function Logo({ size = "default", className }: LogoProps) {
  const textSize = size === "small" ? "text-[19px]" : "text-[22px]";

  return (
    <Link href="/" className={`inline-flex items-center gap-[10px] ${className ?? ""}`}>
      <span className="block h-[14px] w-[14px] bg-accent" aria-hidden="true" />
      <span className={`font-[800] leading-none tracking-[-0.02em] text-ink ${textSize}`}>
        CellCraze
      </span>
    </Link>
  );
}
