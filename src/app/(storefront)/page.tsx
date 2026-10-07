import Link from "next/link";
import {
  ArrowRight,
  Truck,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard, type CategoryCardData } from "@/components/storefront/category-card";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { formatCurrency } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const categories: CategoryCardData[] = [
  { name: "Phones", slug: "phones", image: null, productCount: 42, index: 1 },
  { name: "Headphones", slug: "headphones", image: null, productCount: 18, index: 2 },
  { name: "Earphones", slug: "earphones", image: null, productCount: 24, index: 3 },
  { name: "Chargers", slug: "chargers", image: null, productCount: 31, index: 4 },
  { name: "Smartwatches", slug: "smartwatches", image: null, productCount: 15, index: 5 },
  { name: "Accessories", slug: "accessories", image: null, productCount: 56, index: 6 },
];

const featuredProducts: ProductCardData[] = [
  { id: "1", name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", brand: "Samsung", price: 499900, compareAtPrice: 549900, stockQuantity: 12, images: [{ url: "/placeholder.png", altText: "Galaxy S25 Ultra" }], categorySlug: "phones" },
  { id: "2", name: "iPhone 16 Pro", slug: "iphone-16-pro", brand: "Apple", price: 524900, compareAtPrice: null, stockQuantity: 8, images: [{ url: "/placeholder.png", altText: "iPhone 16 Pro" }], categorySlug: "phones" },
  { id: "3", name: "WH-1000XM5", slug: "sony-wh-1000xm5", brand: "Sony", price: 89900, compareAtPrice: 109900, stockQuantity: 22, images: [{ url: "/placeholder.png", altText: "Sony WH-1000XM5" }], categorySlug: "headphones" },
  { id: "4", name: "Galaxy Watch 7", slug: "galaxy-watch-7", brand: "Samsung", price: 74900, compareAtPrice: null, stockQuantity: 5, images: [{ url: "/placeholder.png", altText: "Galaxy Watch 7" }], categorySlug: "smartwatches" },
  { id: "5", name: "Pixel 9 Pro", slug: "pixel-9-pro", brand: "Google", price: 389900, compareAtPrice: 419900, stockQuantity: 0, images: [{ url: "/placeholder.png", altText: "Pixel 9 Pro" }], categorySlug: "phones" },
  { id: "6", name: "AirPods Pro 2", slug: "airpods-pro-2", brand: "Apple", price: 64900, compareAtPrice: null, stockQuantity: 30, images: [{ url: "/placeholder.png", altText: "AirPods Pro 2" }], categorySlug: "earphones" },
  { id: "7", name: "Galaxy Buds3 Pro", slug: "galaxy-buds3-pro", brand: "Samsung", price: 49900, compareAtPrice: 54900, stockQuantity: 18, images: [{ url: "/placeholder.png", altText: "Galaxy Buds3 Pro" }], categorySlug: "earphones" },
  { id: "8", name: "65W GaN Charger", slug: "65w-gan-charger", brand: "Anker", price: 12900, compareAtPrice: 14900, stockQuantity: 45, images: [{ url: "/placeholder.png", altText: "Anker 65W GaN" }], categorySlug: "chargers" },
];

const newArrivals = [
  { id: "10", brand: "Samsung", name: "Galaxy S25+", category: "Phones", price: 424900, slug: "galaxy-s25-plus" },
  { id: "11", brand: "Apple", name: "iPhone 16e", category: "Phones", price: 199900, slug: "iphone-16e" },
  { id: "12", brand: "Sony", name: "WF-1000XM5", category: "Earphones", price: 72900, slug: "sony-wf-1000xm5" },
  { id: "13", brand: "Xiaomi", name: "14T Pro", category: "Phones", price: 189900, slug: "xiaomi-14t-pro" },
  { id: "14", brand: "Samsung", name: "Galaxy Fit3", category: "Smartwatches", price: 14900, slug: "galaxy-fit3" },
  { id: "15", brand: "Baseus", name: "100W USB-C Cable", category: "Accessories", price: 2490, slug: "baseus-100w-usbc" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="ruled-grid grid-cols-2 rule-bottom">
        {/* Left column */}
        <div className="px-[80px] pt-10 pb-16 flex flex-col justify-center gap-6 max-md:px-gutter-mobile max-md:py-10">
          <span className="text-[13px] uppercase tracking-[0.06em] text-accent-700 font-semibold">
            New this week — Galaxy S25 series
          </span>
          <h1 className="text-[76px] leading-[1.02] max-md:text-[40px]">
            Phones, sound and power.{" "}
            <span className="text-accent">In stock today.</span>
          </h1>
          <p className="text-[17px] text-muted max-w-[44ch] leading-relaxed">
            Sri Lanka&rsquo;s sharpest selection of mobile phones, headphones, chargers
            and accessories. Genuine products, official warranty, island-wide delivery.
          </p>
          <div className="flex gap-3 mt-2">
            <Button size="lg" trailingIcon={<ArrowRight size={18} />}>
              Shop phones
            </Button>
            <Button size="lg" variant="secondary">
              Browse accessories
            </Button>
          </div>
        </div>

        {/* Right column — placeholder image well */}
        <div className="bg-surface min-h-[540px] grayscale" />
      </section>

      {/* ---- Shop by Category ---- */}
      <section>
        <div className="flex items-baseline justify-between px-[40px] pt-14 pb-5 max-md:px-gutter-mobile">
          <h2 className="text-[32px]">Shop by category</h2>
          <Link
            href="/categories"
            className="text-[14px] font-semibold text-accent hover:underline"
          >
            All categories
          </Link>
        </div>
        <div className="ruled-grid grid-cols-6 max-md:grid-cols-2 rule-bottom">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* ---- Featured ---- */}
      <section>
        <div className="flex items-baseline justify-between px-[40px] pt-14 pb-5 max-md:px-gutter-mobile">
          <h2 className="text-[32px]">Featured</h2>
          <Link
            href="/products?featured=true"
            className="text-[14px] font-semibold text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="ruled-grid grid-cols-4 max-md:grid-cols-2 rule-bottom">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---- New Arrivals ---- */}
      <section className="grid grid-cols-[4fr_8fr] max-md:grid-cols-1 rule-bottom">
        <div className="px-[40px] pt-14 pb-10 max-md:px-gutter-mobile">
          <h2 className="text-[32px]">New arrivals</h2>
          <p className="text-[15px] text-muted mt-2 max-w-[32ch]">
            The latest additions to our catalogue, fresh off the shelf.
          </p>
        </div>
        <div className="border-l-2 border-divider max-md:border-l-0 max-md:border-t-2">
          {newArrivals.map((item, i) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="flex items-center gap-5 px-5 py-4 border-b border-divider last:border-b-0 hover:bg-ink/[0.03] transition-colors"
            >
              <span className="text-[12px] tnum text-ink/50 w-[28px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="w-[48px] h-[48px] bg-surface grayscale shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] uppercase tracking-[0.06em] text-ink/60">
                  {item.brand}
                </span>
                <span className="block text-[15px] font-[800] leading-tight truncate">
                  {item.name}
                </span>
              </div>
              <span className="text-[12px] text-muted shrink-0">{item.category}</span>
              <span className="text-[15px] font-[800] tnum shrink-0">
                {formatCurrency(item.price)}
              </span>
              <ArrowRight size={16} className="text-ink/30 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Service Band ---- */}
      <section className="ruled-grid grid-cols-3 max-md:grid-cols-1 rule-bottom">
        {[
          { icon: Truck, title: "Delivered in 2–4 days", desc: "Island-wide delivery with tracking" },
          { icon: CreditCard, title: "Card, cash or transfer", desc: "Multiple payment methods accepted" },
          { icon: ShieldCheck, title: "Genuine, with warranty", desc: "Official products, manufacturer warranty" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="px-[40px] py-10 flex items-start gap-4 max-md:px-gutter-mobile">
            <Icon size={24} className="text-ink shrink-0 mt-[2px]" />
            <div>
              <span className="block text-[16px] font-[800]">{title}</span>
              <span className="block text-[13px] text-muted mt-1">{desc}</span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
