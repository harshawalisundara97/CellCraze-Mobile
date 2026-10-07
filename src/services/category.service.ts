import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          _count: { select: { products: { where: { isActive: true } } } },
        },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        include: {
          _count: { select: { products: { where: { isActive: true } } } },
        },
      },
      parent: true,
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
}

export async function getCategoriesWithProductCount() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
      children: {
        include: {
          _count: { select: { products: { where: { isActive: true } } } },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}
