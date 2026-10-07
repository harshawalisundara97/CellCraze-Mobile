import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";

export async function getInvoices(page = 1, limit = 20, status?: InvoiceStatus) {
  const where: any = {};
  if (status) where.status = status;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        order: {
          select: {
            orderNumber: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return { invoices, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      items: true,
      order: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
          payment: true,
        },
      },
    },
  });
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const data: any = { status };
  if (status === InvoiceStatus.PAID) {
    data.paidAt = new Date();
  }
  return prisma.invoice.update({ where: { id }, data });
}
