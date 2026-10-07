import type { ProductCardData } from "@/components/storefront/product-card";

export interface ApiProductImage {
  url: string;
  altText: string | null;
  isPrimary?: boolean;
}

export interface ApiProduct {
  id: string;
  sku?: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  images: ApiProductImage[];
  category: { name: string; slug: string; parentId?: string | null } | null;
}

export interface ProductListResponse {
  products: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count?: { products: number };
  children?: ApiCategory[];
}

export function toProductCardData(p: ApiProduct): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stockQuantity: p.stockQuantity,
    images: p.images.map((img) => ({ url: img.url, altText: img.altText })),
    categorySlug: p.category?.slug ?? "",
  };
}
