import Link from "next/link";
import { Logo } from "./logo";

const shopLinks = [
  { name: "Phones", href: "/categories/phones" },
  { name: "Headphones", href: "/categories/headphones" },
  { name: "Earphones", href: "/categories/earphones" },
  { name: "Chargers", href: "/categories/chargers" },
  { name: "Smartwatches", href: "/categories/smartwatches" },
];

const helpLinks = [
  { name: "Contact us", href: "/help/contact" },
  { name: "Shipping info", href: "/help/shipping" },
  { name: "Returns", href: "/help/returns" },
  { name: "FAQ", href: "/help/faq" },
];

const accountLinks = [
  { name: "Sign in", href: "/account" },
  { name: "My orders", href: "/account/orders" },
  { name: "Track order", href: "/orders/track" },
  { name: "Wishlist", href: "/account/wishlist" },
];

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] uppercase font-[600] tracking-[0.08em] text-muted mb-4">
        {heading}
      </h4>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-[14px] text-ink hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StorefrontFooter() {
  return (
    <footer className="rule-top mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-[4fr_2fr_2fr_2fr] gap-10 px-4 md:px-[40px] py-12">
        <div>
          <Logo size="small" />
          <p className="mt-4 text-[14px] text-muted max-w-[320px] leading-relaxed">
            Sri Lanka&apos;s trusted destination for mobile phones and
            accessories. Genuine products, official warranty, and fast island-wide
            delivery.
          </p>
        </div>

        <FooterColumn heading="Shop" links={shopLinks} />
        <FooterColumn heading="Help" links={helpLinks} />
        <FooterColumn heading="Account" links={accountLinks} />
      </div>

      <div className="rule-top flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-[40px] py-4 gap-2">
        <span className="text-[12px] text-muted">
          &copy; 2026 CellCraze. All rights reserved.
        </span>
        <span className="text-[12px] text-muted">
          Visa &middot; Mastercard &middot; Cash on delivery &middot; Bank transfer
        </span>
      </div>
    </footer>
  );
}
