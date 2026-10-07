"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const allProducts: ProductCardData[] = [
  { id: "1", name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", brand: "Samsung", price: 499900, compareAtPrice: 549900, stockQuantity: 12, images: [{ url: "/placeholder.png", altText: "Galaxy S25 Ultra" }], categorySlug: "phones" },
  { id: "2", name: "iPhone 16 Pro", slug: "iphone-16-pro", brand: "Apple", price: 524900, compareAtPrice: null, stockQuantity: 8, images: [{ url: "/placeholder.png", altText: "iPhone 16 Pro" }], categorySlug: "phones" },
  { id: "3", name: "WH-1000XM5", slug: "sony-wh-1000xm5", brand: "Sony", price: 89900, compareAtPrice: 109900, stockQuantity: 22, images: [{ url: "/placeholder.png", altText: "Sony WH-1000XM5" }], categorySlug: "headphones" },
  { id: "5", name: "Pixel 9 Pro", slug: "pixel-9-pro", brand: "Google", price: 389900, compareAtPrice: 419900, stockQuantity: 0, images: [{ url: "/placeholder.png", altText: "Pixel 9 Pro" }], categorySlug: "phones" },
  { id: "6", name: "AirPods Pro 2", slug: "airpods-pro-2", brand: "Apple", price: 64900, compareAtPrice: null, stockQuantity: 30, images: [{ url: "/placeholder.png", altText: "AirPods Pro 2" }], categorySlug: "earphones" },
  { id: "8", name: "65W GaN Charger", slug: "65w-gan-charger", brand: "Anker", price: 12900, compareAtPrice: 14900, stockQuantity: 45, images: [{ url: "/placeholder.png", altText: "Anker 65W GaN" }], categorySlug: "chargers" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-[40px] py-10 text-muted">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.categorySlug.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Search</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-6">Search</h1>

      <div className="max-w-[480px] mb-8">
        <Input
          variant="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />
      </div>

      <div className="rule-top pt-6">
        <p className="text-[15px] text-muted mb-6">
          <span className="tnum font-[800] text-ink">{results.length}</span>{" "}
          {results.length === 1 ? "result" : "results"}
          {query.trim() && (
            <>
              {" "}for &lsquo;<span className="text-ink font-semibold">{query.trim()}</span>&rsquo;
            </>
          )}
        </p>

        <div className="ruled-grid grid-cols-3 max-md:grid-cols-2">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {results.length === 0 && (
          <p className="text-[15px] text-muted py-10 text-center">
            No products found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}
