"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { formatCurrency } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";
import { useCartStore } from "@/stores/cart.store";
import type { ApiProduct } from "@/types/api";

interface ProductDetail extends ApiProduct {
  model: string | null;
  sku: string;
  description: string | null;
  specifications: Record<string, string> | null;
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;
  const { data: product, loading, error } = useApi<ProductDetail>(
    slug ? `/api/products/${slug}` : null,
  );

  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  if (loading) {
    return (
      <div className="px-[40px] py-16 text-[15px] text-muted max-md:px-gutter-mobile">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-[40px] py-16 max-md:px-gutter-mobile">
        <h1 className="text-[32px] mb-3">Product not found</h1>
        <p className="text-[15px] text-muted mb-6">
          We couldn&rsquo;t find the product you were looking for.
        </p>
        <Button onClick={() => router.push("/products")}>
          Back to products
        </Button>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
      )
    : 0;

  const specs = product.specifications ?? {};
  const primaryImage = product.images[0];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage?.url ?? null,
      stock: product.stockQuantity,
      quantity,
    });
  };

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-ink">Products</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-ink">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-2 gap-0 max-md:grid-cols-1 rule-bottom">
        <div className="bg-surface min-h-[560px] grayscale border-r-2 border-divider max-md:border-r-0 max-md:min-h-[320px]" />

        <div className="px-10 py-10 max-md:px-0 max-md:py-6">
          {product.brand && (
            <span className="text-[11px] uppercase tracking-[0.08em] text-ink/60 font-semibold">
              {product.brand}
            </span>
          )}
          <h1 className="text-[48px] max-md:text-[32px] mt-1 mb-3">{product.name}</h1>
          <p className="text-[13px] text-muted mb-1">SKU: {product.sku}</p>

          <div className="flex items-baseline gap-3 mt-4 mb-6">
            <span className="text-[32px] font-[800] tnum">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-[18px] text-muted line-through tnum">
                  {formatCurrency(product.compareAtPrice)}
                </span>
                <Tag variant="accent">-{discount}%</Tag>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-[15px] text-muted leading-relaxed mb-8 max-w-[50ch]">
              {product.description}
            </p>
          )}

          {product.stockQuantity > 0 ? (
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center border-2 border-divider">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-[44px] h-[44px] flex items-center justify-center hover:bg-ink/[0.05]"
                >
                  <Minus size={16} />
                </button>
                <span className="w-[44px] h-[44px] flex items-center justify-center text-[15px] font-[800] tnum border-x-2 border-divider">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="w-[44px] h-[44px] flex items-center justify-center hover:bg-ink/[0.05]"
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button size="lg" block leadingIcon={<ShoppingCart size={18} />} onClick={handleAddToCart}>
                Add to cart
              </Button>
            </div>
          ) : (
            <Tag variant="neutral" className="mb-8">Out of stock</Tag>
          )}

          <p className="text-[13px] text-muted">
            {product.stockQuantity > 0
              ? `${product.stockQuantity} in stock — ships in 1–2 business days`
              : "Currently unavailable"}
          </p>
        </div>
      </div>

      {Object.keys(specs).length > 0 && (
        <section className="py-10">
          <h2 className="text-[24px] mb-6">Specifications</h2>
          <div className="border-t-2 border-divider">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex border-b border-divider py-3 text-[14px]">
                <span className="w-[200px] shrink-0 font-semibold text-ink/70">{key}</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
