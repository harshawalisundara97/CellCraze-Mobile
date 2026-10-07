import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface ProductFilters {
  categorySlug?: string;
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  search?: string;
  isFeatured?: boolean;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: "featured" | "price_asc" | "price_desc" | "newest";
}

export async function getProducts(
  filters: ProductFilters = {},
  pagination: PaginationOptions = {}
) {
  const { page = 1, limit = 12, sort = "featured" } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }
  if (filters.brands?.length) {
    where.brand = { in: filters.brands };
  }
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    where.price = {};
    if (filters.priceMin !== undefined) where.price.gte = filters.priceMin;
    if (filters.priceMax !== undefined) where.price.lte = filters.priceMax;
  }
  if (filters.inStockOnly) {
    where.stockQuantity = { gt: 0 };
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { brand: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { sku: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.isFeatured) {
    where.isFeatured = true;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case "price_asc": return { price: "asc" as const };
      case "price_desc": return { price: "desc" as const };
      case "newest": return { createdAt: "desc" as const };
      default: return { isFeatured: "desc" as const };
    }
  })();

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { name: true, slug: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { name: true, slug: true, parentId: true } },
    },
  });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { where: { isPrimary: true } },
      category: { select: { name: true, slug: true } },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: productId },
    },
    include: {
      images: { where: { isPrimary: true } },
      category: { select: { name: true, slug: true } },
    },
    take: limit,
  });
}

export async function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({
    data,
    include: { images: true, category: true },
  });
}

export async function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({
    where: { id },
    data,
    include: { images: true, category: true },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}
