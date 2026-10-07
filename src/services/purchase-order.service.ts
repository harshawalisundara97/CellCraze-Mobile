import { prisma } from "@/lib/prisma";
import { POStatus } from "@prisma/client";
import { generatePONumber } from "@/lib/utils";

interface POLineInput {
  productId: string;
  quantity: number;
  unitCost: number;
}

export async function createPurchaseOrder(
  supplierId: string,
  lines: POLineInput[],
  userId: string,
  notes?: string
) {
  const totalAmount = lines.reduce(
    (sum, line) => sum + line.quantity * line.unitCost,
    0
  );

  return prisma.purchaseOrder.create({
    data: {
      poNumber: generatePONumber(),
      supplierId,
      status: POStatus.DRAFT,
      totalAmount,
      notes,
      createdById: userId,
      items: {
        create: lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          unitCost: line.unitCost,
          totalCost: line.quantity * line.unitCost,
        })),
      },
    },
    include: {
      items: { include: { product: { select: { name: true, sku: true } } } },
      supplier: true,
    },
  });
}

export async function sendPurchaseOrder(poId: string) {
  return prisma.purchaseOrder.update({
    where: { id: poId },
    data: { status: POStatus.SENT },
  });
}

export async function getPurchaseOrders(page = 1, limit = 20, status?: POStatus) {
  const where: any = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: { select: { name: true } },
        _count: { select: { items: true, grns: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.purchaseOrder.count({ where }),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getPurchaseOrderById(id: string) {
  return prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { select: { name: true, sku: true, stockQuantity: true } } },
      },
      supplier: true,
      grns: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
      },
      createdBy: { select: { name: true } },
    },
  });
}

export async function getReceivablePOs() {
  return prisma.purchaseOrder.findMany({
    where: {
      status: { in: [POStatus.SENT, POStatus.PARTIALLY_RECEIVED] },
    },
    include: {
      items: {
        include: { product: { select: { name: true, sku: true } } },
      },
      supplier: { select: { name: true, contactPerson: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
