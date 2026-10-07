import { prisma } from "@/lib/prisma";

export async function getDashboardStats(days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    revenueToday,
    ordersToday,
    newCustomers,
    outOfStock,
    lowStock,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: today },
        status: { not: "CANCELLED" },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: today },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: since },
        role: "CUSTOMER",
      },
    }),
    prisma.product.count({
      where: { isActive: true, stockQuantity: 0 },
    }),
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM "Product"
      WHERE "isActive" = true
      AND "stockQuantity" > 0
      AND "stockQuantity" <= "reorderPoint"
    `,
  ]);

  return {
    revenueToday: Number(revenueToday._sum.totalAmount || 0),
    ordersToday,
    newCustomers,
    outOfStock,
    lowStock: Number(lowStock[0]?.count || 0),
  };
}

export async function getSalesChartData(days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      status: { not: "CANCELLED" },
    },
    select: {
      createdAt: true,
      totalAmount: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const dailyMap = new Map<string, { date: string; revenue: number; orders: number }>();

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().split("T")[0];
    dailyMap.set(key, { date: key, revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().split("T")[0];
    const entry = dailyMap.get(key);
    if (entry) {
      entry.revenue += Number(order.totalAmount);
      entry.orders += 1;
    }
  }

  return Array.from(dailyMap.values());
}

export async function getRecentOrders(limit = 10) {
  return prisma.order.findMany({
    include: {
      user: { select: { name: true } },
      payment: { select: { method: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getSalesByCategory() {
  const results = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { totalPrice: true },
    _count: true,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: results.map((r) => r.productId) } },
    select: { id: true, categoryId: true, category: { select: { name: true } } },
  });

  const categoryMap = new Map<string, { name: string; total: number }>();

  for (const result of results) {
    const product = products.find((p) => p.id === result.productId);
    if (!product) continue;
    const catName = product.category.name;
    const existing = categoryMap.get(catName) || { name: catName, total: 0 };
    existing.total += Number(result._sum.totalPrice || 0);
    categoryMap.set(catName, existing);
  }

  const categories = Array.from(categoryMap.values()).sort(
    (a, b) => b.total - a.total
  );

  const maxTotal = categories[0]?.total || 1;
  return categories.map((c) => ({
    ...c,
    percentage: Math.round((c.total / maxTotal) * 100),
  }));
}

export async function getSalesReport(startDate: Date, endDate: Date) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { not: "CANCELLED" },
    },
    include: {
      items: {
        include: {
          product: { select: { costPrice: true, category: { select: { name: true } } } },
        },
      },
    },
  });

  let totalRevenue = 0;
  let totalCost = 0;
  let totalOrders = orders.length;

  for (const order of orders) {
    totalRevenue += Number(order.totalAmount);
    for (const item of order.items) {
      totalCost += Number(item.product.costPrice) * item.quantity;
    }
  }

  return {
    totalRevenue,
    totalCost,
    grossProfit: totalRevenue - totalCost,
    profitMargin: totalRevenue > 0
      ? Math.round(((totalRevenue - totalCost) / totalRevenue) * 100)
      : 0,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
  };
}

export async function getTopProducts(limit = 10) {
  const results = await prisma.orderItem.groupBy({
    by: ["productId", "productName", "productSku"],
    _sum: { quantity: true, totalPrice: true },
    orderBy: { _sum: { totalPrice: "desc" } },
    take: limit,
  });

  return results.map((r) => ({
    productId: r.productId,
    name: r.productName,
    sku: r.productSku,
    unitsSold: r._sum.quantity || 0,
    revenue: Number(r._sum.totalPrice || 0),
  }));
}

export async function getInventoryValue() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { costPrice: true, price: true, stockQuantity: true },
  });

  let totalCostValue = 0;
  let totalRetailValue = 0;

  for (const p of products) {
    totalCostValue += Number(p.costPrice) * p.stockQuantity;
    totalRetailValue += Number(p.price) * p.stockQuantity;
  }

  return {
    totalCostValue,
    totalRetailValue,
    potentialProfit: totalRetailValue - totalCostValue,
    totalProducts: products.length,
    totalUnits: products.reduce((sum, p) => sum + p.stockQuantity, 0),
  };
}
