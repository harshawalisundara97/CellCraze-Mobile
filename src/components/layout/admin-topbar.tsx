import { Button } from "@/components/ui/button";

interface AdminTopbarProps {
  children?: React.ReactNode;
}

export function AdminTopbar({ children }: AdminTopbarProps) {
  return (
    <div className="flex items-center justify-between px-8 py-5 rule-bottom">
      <div className="flex-1">{children}</div>

      <div className="flex items-center gap-3">
        {/* Segmented control placeholder */}
        <div className="hidden md:flex border border-divider text-[13px] font-[600]">
          <span className="px-3 py-[6px] bg-surface text-ink">Day</span>
          <span className="px-3 py-[6px] text-muted">Week</span>
          <span className="px-3 py-[6px] text-muted">Month</span>
        </div>

        <Button variant="secondary" size="default">
          Export CSV
        </Button>

        <div
          className="flex items-center justify-center w-[36px] h-[36px] bg-ink text-bg text-[13px] font-[800] select-none shrink-0"
          aria-label="User avatar"
        >
          AD
        </div>
      </div>
    </div>
  );
}
