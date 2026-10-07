"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    heading: "Catalog",
    items: [
      { label: "Products", href: "/admin/products" },
      { label: "Categories", href: "/admin/categories" },
    ],
  },
  {
    heading: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders" },
      { label: "Invoices", href: "/admin/invoices" },
    ],
  },
  {
    heading: "Supply",
    items: [
      { label: "Inventory", href: "/admin/inventory" },
      { label: "Suppliers", href: "/admin/suppliers" },
      { label: "Purchase orders", href: "/admin/purchase-orders" },
      { label: "Goods received", href: "/admin/grn" },
    ],
  },
  {
    heading: "Insights",
    items: [{ label: "Reports", href: "/admin/reports" }],
  },
  {
    heading: "Store",
    items: [{ label: "Settings", href: "/admin/settings" }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-[232px] min-h-screen border-r-2 border-divider bg-bg py-5 flex flex-col overflow-y-auto shrink-0">
      <div className="px-5 mb-6">
        <Logo size="small" />
        <span className="block mt-1 text-[11px] uppercase tracking-[0.08em] font-[600] text-muted">
          Back office
        </span>
      </div>

      <nav className="flex flex-col gap-5">
        {navGroups.map((group) => (
          <div key={group.heading}>
            <h5 className="px-5 mb-1 text-[11px] uppercase tracking-[0.08em] font-[600] text-muted">
              {group.heading}
            </h5>
            <ul>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-[10px] px-5 py-[7px] text-[14px] transition-colors ${
                        active
                          ? "bg-surface font-[800] text-ink"
                          : "font-[400] text-ink hover:bg-ink/[0.05]"
                      }`}
                    >
                      <span
                        className={`block w-2 h-2 shrink-0 ${
                          active ? "bg-accent" : "bg-transparent"
                        }`}
                        aria-hidden="true"
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
