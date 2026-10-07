"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { useApi } from "@/hooks/use-api";
import {
  type ApiCategory,
  type ProductListResponse,
  toProductCardData,
} from "@/types/api";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const { data: productData, loading } = useApi<ProductListResponse>(
    slug ? `/api/products?category=${encodeURIComponent(slug)}&limit=1000` : null,
  );
  const { data: categoryData } = useApi<ApiCategory[]>("/api/categories");

  const products = (productData?.products ?? []).map(toProductCardData);
  const category =
    (categoryData ?? [])
      .flatMap((c) => [c, ...(c.children ?? [])])
      .find((c) => c.slug === slug) ?? null;
  const title = category?.name ?? slug ?? "Category";

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-ink">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">{title}</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-2">{title}</h1>
      <p className="text-[15px] text-muted mb-8">
        {loading
          ? "Loading products..."
          : `${products.length} ${products.length === 1 ? "product" : "products"}`}
      </p>

      {products.length === 0 && !loading ? (
        <p className="text-[15px] text-muted py-10">
          No products in this category yet.
        </p>
      ) : (
        <div className="ruled-grid grid-cols-4 max-md:grid-cols-2 rule-bottom">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
