import { prisma } from "@/lib/prisma";

export async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    const cart = await prisma.cart.findUnique({
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
    if (cart) return cart;

    return prisma.cart.create({
      data: { userId },
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
  }

  if (sessionId) {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
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
    if (cart) return cart;

    return prisma.cart.create({
      data: { sessionId },
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
  }

  throw new Error("Either userId or sessionId is required");
}

export async function addToCart(
  cartId: string,
  productId: string,
  quantity: number
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");
  if (!product.isActive) throw new Error("Product is not available");

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });

  const newQty = existing ? existing.quantity + quantity : quantity;
  if (newQty > product.stockQuantity) {
    throw new Error(`Only ${product.stockQuantity} units available`);
  }

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
  }

  return prisma.cartItem.create({
    data: { cartId, productId, quantity },
    include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
  });
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });
  if (!item) throw new Error("Cart item not found");
  if (quantity > item.product.stockQuantity) {
    throw new Error(`Only ${item.product.stockQuantity} units available`);
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
  });
}

export async function removeCartItem(itemId: string) {
  return prisma.cartItem.delete({ where: { id: itemId } });
}

export async function mergeGuestCart(sessionId: string, userId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) return;

  const userCart = await getOrCreateCart(userId);

  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: userCart.id, productId: item.productId },
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
}
