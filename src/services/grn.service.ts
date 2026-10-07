import { prisma } from "@/lib/prisma";
import { GRNStatus, POStatus } from "@prisma/client";
import { generateGRNNumber } from "@/lib/utils";

interface GRNLineInput {
  poItemId: string;
  productId: string;
  receivedQty: number;
  rejectedQty: number;
  notes?: string;
}

export async function createGRN(
  purchaseOrderId: string,
  receivedDate: Date,
  lines: GRNLineInput[],
  userId: string,
  notes?: string
) {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id: purchaseOrderId },
    include: { items: true },
  });

  if (!po) throw new Error("Purchase order not found");
  if (po.status !== POStatus.SENT && po.status !== POStatus.PARTIALLY_RECEIVED) {
    throw new Error("Purchase order is not in a receivable state");
  }

  return prisma.gRN.create({
    data: {
      grnNumber: generateGRNNumber(),
      purchaseOrderId,
      supplierId: po.supplierId,
      status: GRNStatus.DRAFT,
      receivedDate,
      notes,
      createdById: userId,
      items: {
        create: lines.map((line) => ({
          poItemId: line.poItemId,
          productId: line.productId,
          receivedQty: line.receivedQty,
          rejectedQty: line.rejectedQty,
          notes: line.notes,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: { select: { name: true, sku: true } },
          poItem: true,
        },
      },
      purchaseOrder: true,
    },
  });
}

export async function confirmGRN(grnId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const grn = await tx.gRN.findUnique({
      where: { id: grnId },
      include: {
        items: { include: { poItem: true } },
        purchaseOrder: { include: { items: true } },
      },
    });

    if (!grn) throw new Error("GRN not found");
    if (grn.status === GRNStatus.CONFIRMED) throw new Error("GRN already confirmed");

    await tx.gRN.update({
      where: { id: grnId },
      data: { status: GRNStatus.CONFIRMED },
    });

    for (const item of grn.items) {
      const stockToAdd = item.receivedQty - item.rejectedQty;

      if (stockToAdd > 0) {
        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: "STOCK_IN",
            quantity: stockToAdd,
            referenceType: "GRN",
            referenceId: grn.id,
            notes: `GRN ${grn.grnNumber} - received ${item.receivedQty}, rejected ${item.rejectedQty}`,
            createdById: userId,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: stockToAdd } },
        });
      }

      await tx.pOItem.update({
        where: { id: item.poItemId },
        data: { receivedQty: { increment: item.receivedQty } },
      });
    }

    const updatedPO = await tx.purchaseOrder.findUnique({
      where: { id: grn.purchaseOrderId },
      include: { items: true },
    });

    if (updatedPO) {
      const allFullyReceived = updatedPO.items.every(
        (item) => item.receivedQty >= item.quantity
      );

      await tx.purchaseOrder.update({
        where: { id: grn.purchaseOrderId },
        data: {
          status: allFullyReceived
            ? POStatus.FULLY_RECEIVED
            : POStatus.PARTIALLY_RECEIVED,
        },
      });
    }

    return grn;
  });
}

export async function getGRNs(page = 1, limit = 20) {
  const [grns, total] = await Promise.all([
    prisma.gRN.findMany({
      include: {
        purchaseOrder: { select: { poNumber: true } },
        supplier: { select: { name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.gRN.count(),
  ]);

  return { grns, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getGRNById(id: string) {
  return prisma.gRN.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { name: true, sku: true } },
          poItem: true,
        },
      },
      purchaseOrder: {
        include: {
          items: { include: { product: { select: { name: true, sku: true } } } },
          supplier: true,
        },
      },
      supplier: true,
      createdBy: { select: { name: true } },
    },
  });
}
