"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getStockStatus } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  images: { url: string; altText: string | null }[];
  categorySlug: string;
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const stock = getStockStatus(product.stockQuantity);
  const primaryImage = product.images[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : null;

  return (
    <div className="p-5 flex flex-col gap-[14px]">
      {/* Image well */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square bg-surface overflow-hidden"
      >
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.name}
            fill
            className="object-contain grayscale"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        {discount && (
          <span className="absolute top-0 left-0 bg-accent text-bg text-[11px] font-[800] px-[6px] py-[3px] leading-none">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Brand + name */}
      <div>
        {product.brand && (
          <span className="block text-[11px] uppercase tracking-[0.06em] text-ink/70 mb-[2px]">
            {product.brand}
          </span>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="block text-[16px] font-[800] leading-tight text-ink hover:text-accent transition-colors"
        >
          {product.name}
        </Link>
      </div>

      {/* Prices */}
      <div className="flex items-baseline gap-2">
        <span className="text-[19px] font-[800] text-ink">
          {formatCurrency(product.price)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="text-[13px] line-through text-ink/60">
            {formatCurrency(product.compareAtPrice)}
          </span>
        )}
      </div>

      {/* Stock indicator */}
      <div className="flex items-center gap-[6px]">
        <span
          className={`block w-2 h-2 ${
            stock.color === "accent"
              ? "bg-accent"
              : stock.color === "neutral-400"
                ? "bg-neutral-400"
                : "bg-ink"
          }`}
          aria-hidden="true"
        />
        <span className="text-[12px] text-muted">{stock.label}</span>
      </div>

      {/* Action button */}
      {product.stockQuantity > 0 ? (
        <Button
          variant="secondary"
          block
          trailingIcon={<Plus size={16} />}
          className="mt-auto"
        >
          Add to cart
        </Button>
      ) : (
        <Button
          variant="secondary"
          block
          trailingIcon={<Bell size={16} />}
          className="mt-auto"
        >
          Notify me
        </Button>
      )}
    </div>
  );
}
