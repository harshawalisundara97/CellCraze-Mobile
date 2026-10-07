"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import { Logo } from "./logo";

const utilityMessages = [
  "Free delivery over Rs 10,000",
  "Cash on delivery available",
  "Official warranty on every device",
];

const categories = [
  { name: "Phones", href: "/categories/phones" },
  { name: "Headphones", href: "/categories/headphones" },
  { name: "Earphones", href: "/categories/earphones" },
  { name: "Chargers", href: "/categories/chargers" },
  { name: "Smartwatches", href: "/categories/smartwatches" },
  { name: "Accessories", href: "/categories/accessories" },
];

export function StorefrontHeader() {
  const cartCount = 0;

  return (
    <header>
      {/* Utility bar -- hidden on mobile */}
      <div className="hidden md:flex items-center bg-ink text-bg text-[12px] px-[40px] py-2 gap-8">
        {utilityMessages.map((msg) => (
          <span key={msg}>{msg}</span>
        ))}
        <Link href="/orders/track" className="ml-auto hover:underline">
          Track your order
        </Link>
      </div>

      {/* Main bar -- desktop */}
      <div className="hidden md:grid grid-cols-[220px_1fr_auto] gap-8 items-center px-[40px] py-[18px] rule-bottom">
        <Logo />

        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="text"
            placeholder="Search phones, accessories..."
            className="w-full h-[42px] border border-divider bg-surface pl-[36px] pr-[12px] text-[14px] text-ink placeholder:text-neutral-500 hover:border-ink/45 focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 bg-transparent text-ink text-[14px] font-[600] px-[10px] py-[8px] hover:bg-ink/[0.07] transition-colors"
          >
            <User size={18} />
            Sign in
          </Link>

          <Link
            href="/account/wishlist"
            className="inline-flex items-center justify-center h-[36px] w-[36px] text-ink hover:bg-ink/[0.07] transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 bg-accent text-bg text-[14px] font-[800] px-[14px] py-[8px] min-h-[36px] hover:bg-accent-600 transition-colors"
          >
            <ShoppingBag size={18} />
            Cart
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] bg-bg text-ink text-[11px] font-[800] px-[4px] leading-none">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Main bar -- mobile */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 rule-bottom">
        <button
          className="inline-flex items-center justify-center h-[36px] w-[36px] text-ink"
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>

        <Logo size="small" />

        <Link
          href="/cart"
          className="relative inline-flex items-center justify-center h-[36px] w-[36px] text-ink"
          aria-label="Cart"
        >
          <ShoppingBag size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-[16px] bg-accent text-bg text-[10px] font-[800] px-[3px] leading-none">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile search row */}
      <div className="md:hidden px-4 py-2 rule-bottom">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="text"
            placeholder="Search phones, accessories..."
            className="w-full h-[38px] border border-divider bg-surface pl-[34px] pr-[10px] text-[14px] text-ink placeholder:text-neutral-500 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Category bar -- hidden on mobile */}
      <nav className="hidden md:flex items-center gap-7 px-[40px] py-[12px] rule-bottom">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="text-[14px] font-[600] text-ink hover:text-accent transition-colors"
          >
            {cat.name}
          </Link>
        ))}
        <Link
          href="/categories/deals"
          className="ml-auto text-[14px] font-[600] text-accent-700 hover:text-accent transition-colors"
        >
          Deals
        </Link>
      </nav>
    </header>
  );
}
