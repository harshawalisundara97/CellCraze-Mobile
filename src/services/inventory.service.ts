import { prisma } from "@/lib/prisma";
import { InventoryTransactionType } from "@prisma/client";

export async function addStock(
  productId: string,
  quantity: number,
  referenceType: string,
  referenceId: string,
  userId?: string,
  notes?: string
) {
  return prisma.$transaction(async (tx) => {
    await tx.inventoryTransaction.create({
      data: {
        productId,
        type: InventoryTransactionType.STOCK_IN,
        quantity,
        referenceType,
        referenceId,
        notes,
        createdById: userId,
      },
    });

    return tx.product.update({
      where: { id: productId },
      data: { stockQuantity: { increment: quantity } },
    });
  });
}

export async function deductStock(
  productId: string,
  quantity: number,
  referenceType: string,
  referenceId: string,
  userId?: string,
  notes?: string
) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product || product.stockQuantity < quantity) {
      throw new Error(`Insufficient stock for product ${productId}`);
    }

    await tx.inventoryTransaction.create({
      data: {
        productId,
        type: InventoryTransactionType.STOCK_OUT,
        quantity: -quantity,
        referenceType,
        referenceId,
        notes,
        createdById: userId,
      },
    });

    return tx.product.update({
      where: { id: productId },
      data: { stockQuantity: { decrement: quantity } },
    });
  });
}

export async function adjustStock(
  productId: string,
  quantity: number,
  type: InventoryTransactionType,
  userId: string,
  notes?: string
) {
  return prisma.$transaction(async (tx) => {
    await tx.inventoryTransaction.create({
      data: {
        productId,
        type,
        quantity,
        referenceType: "MANUAL_ADJUSTMENT",
        notes,
        createdById: userId,
      },
    });

    if (quantity > 0) {
      return tx.product.update({
        where: { id: productId },
        data: { stockQuantity: { increment: quantity } },
      });
    } else {
      return tx.product.update({
        where: { id: productId },
        data: { stockQuantity: { decrement: Math.abs(quantity) } },
      });
    }
  });
}

export async function getLowStockProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { stockQuantity: 0 },
        {
          stockQuantity: { lte: prisma.product.fields.reorderPoint as any },
        },
      ],
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true } },
    },
    orderBy: { stockQuantity: "asc" },
  });
}

export async function getOutOfStockProducts() {
  return prisma.product.findMany({
    where: { isActive: true, stockQuantity: 0 },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true } },
    },
  });
}

export async function getInventoryTransactions(
  productId?: string,
  type?: InventoryTransactionType,
  page = 1,
  limit = 20
) {
  const where: any = {};
  if (productId) where.productId = productId;
  if (type) where.type = type;

  const [transactions, total] = await Promise.all([
    prisma.inventoryTransaction.findMany({
      where,
      include: {
        product: { select: { name: true, sku: true } },
        createdBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inventoryTransaction.count({ where }),
  ]);

  return { transactions, total, page, totalPages: Math.ceil(total / limit) };
}

export async function checkReorderAlerts() {
  const products = await prisma.$queryRaw<Array<{ id: string; name: string; stockQuantity: number; reorderPoint: number }>>`
    SELECT id, name, "stockQuantity", "reorderPoint"
    FROM "Product"
    WHERE "isActive" = true AND "stockQuantity" <= "reorderPoint"
    ORDER BY "stockQuantity" ASC
  `;
  return products;
}
