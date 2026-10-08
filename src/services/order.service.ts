import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { generateOrderNumber, generateInvoiceNumber } from "@/lib/utils";
import * as inventoryService from "./inventory.service";

export async function createOrder(
  userId: string,
  addressId: string,
  paymentMethod: PaymentMethod,
  notes?: string
) {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const address = await tx.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new Error("Address not found");

    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const shippingCost = subtotal >= 10000 ? 0 : 500;
    const totalAmount = subtotal + shippingCost;

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        addressSnapshot: {
          recipientName: address.recipientName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          province: address.province,
          postalCode: address.postalCode,
          country: address.country,
        },
        status: paymentMethod === "STRIPE" ? OrderStatus.PENDING : OrderStatus.CONFIRMED,
        subtotal,
        shippingCost,
        totalAmount,
        notes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            unitPrice: item.product.price,
            quantity: item.quantity,
            totalPrice: Number(item.product.price) * item.quantity,
          })),
        },
        payment: {
          create: {
            method: paymentMethod,
            status: PaymentStatus.PENDING,
            amount: totalAmount,
          },
        },
      },
      include: { items: true, payment: true },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  userId?: string
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payment: true },
  });

  if (!order) throw new Error("Order not found");

  if (status === OrderStatus.DELIVERED) {
    return prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      for (const item of order.items) {
        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: "STOCK_OUT",
            quantity: -item.quantity,
            referenceType: "ORDER",
            referenceId: order.id,
            notes: `Order ${order.orderNumber} delivered`,
            createdById: userId,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      if (order.payment) {
        const invoiceStatus =
          order.payment.status === "COMPLETED" ? "PAID" : "SENT";

        await tx.invoice.create({
          data: {
            invoiceNumber: generateInvoiceNumber(),
            orderId: order.id,
            customerId: order.userId,
            status: invoiceStatus as any,
            subtotal: order.subtotal,
            taxAmount: order.taxAmount,
            totalAmount: order.totalAmount,
            items: {
              create: order.items.map((item) => ({
                description: `${item.productName} (${item.productSku})`,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              })),
            },
          },
        });
      }

      return updatedOrder;
    });
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export async function getOrders(userId: string, page = 1, limit = 10) {
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getOrderById(orderId: string, userId?: string) {
  const where: any = { id: orderId };
  if (userId) where.userId = userId;

  return prisma.order.findFirst({
    where,
    include: {
      items: {
        include: {
          product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        },
      },
      payment: true,
      invoice: true,
    },
  });
}

export async function getOrderByIdForAdmin(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        },
      },
      payment: true,
      invoice: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });
}

export async function getAllOrders(
  page = 1,
  limit = 20,
  status?: OrderStatus,
  search?: string
) {
  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

export async function cancelOrder(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId, status: OrderStatus.PENDING },
  });

  if (!order) throw new Error("Order not found or cannot be cancelled");

  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
  });
}
