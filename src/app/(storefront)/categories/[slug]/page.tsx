"use client";

import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";

const categoryProducts: ProductCardData[] = [
  { id: "1", name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", brand: "Samsung", price: 389900, compareAtPrice: 419900, stockQuantity: 12, images: [{ url: "/placeholder.png", altText: "Galaxy S25 Ultra" }], categorySlug: "phones" },
  { id: "2", name: "iPhone 16 Pro", slug: "iphone-16-pro", brand: "Apple", price: 449900, compareAtPrice: 479900, stockQuantity: 15, images: [{ url: "/placeholder.png", altText: "iPhone 16 Pro" }], categorySlug: "phones" },
  { id: "3", name: "Pixel 9 Pro", slug: "pixel-9-pro", brand: "Google", price: 299900, compareAtPrice: 329900, stockQuantity: 7, images: [{ url: "/placeholder.png", altText: "Pixel 9 Pro" }], categorySlug: "phones" },
  { id: "4", name: "OnePlus 13", slug: "oneplus-13", brand: "OnePlus", price: 249900, compareAtPrice: null, stockQuantity: 20, images: [{ url: "/placeholder.png", altText: "OnePlus 13" }], categorySlug: "phones" },
];

export default function CategoryPage() {
  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-ink">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Phones</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-2">Phones</h1>
      <p className="text-[15px] text-muted mb-8">Latest smartphones from top brands</p>

      <div className="ruled-grid grid-cols-4 max-md:grid-cols-2 rule-bottom">
        {categoryProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
