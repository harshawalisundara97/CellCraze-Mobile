import { prisma } from "@/lib/prisma";

export async function getSuppliers(page = 1, limit = 20, activeOnly = false) {
  const where: any = {};
  if (activeOnly) where.isActive = true;

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.supplier.count({ where }),
  ]);

  return { suppliers, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getSupplierById(id: string) {
  return prisma.supplier.findUnique({
    where: { id },
    include: {
      purchaseOrders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { _count: { select: { items: true } } },
      },
    },
  });
}

export async function createSupplier(data: {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  return prisma.supplier.create({ data });
}

export async function updateSupplier(
  id: string,
  data: {
    name?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive?: boolean;
  }
) {
  return prisma.supplier.update({ where: { id }, data });
}

export async function deactivateSupplier(id: string) {
  return prisma.supplier.update({
    where: { id },
    data: { isActive: false },
  });
}
