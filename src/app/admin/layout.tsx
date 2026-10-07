import { Suspense } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

export const instant = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<div className="w-[240px] bg-neutral-950" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <Suspense fallback={<div className="h-[56px] border-b-2 border-neutral-200" />}>
          <AdminTopbar />
        </Suspense>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
