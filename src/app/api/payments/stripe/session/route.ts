import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true, payment: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.payment?.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email!,
      metadata: { orderId: order.id, userId },
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "lkr",
          product_data: { name: item.productName },
          unit_amount: Math.round(Number(item.unitPrice) * 100),
        },
        quantity: item.quantity,
      })),
      ...(Number(order.shippingCost) > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  fixed_amount: {
                    amount: Math.round(Number(order.shippingCost) * 100),
                    currency: "lkr",
                  },
                  display_name: "Standard Shipping",
                },
              },
            ],
          }
        : {}),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?payment=cancelled`,
    });

    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { stripeSessionId: checkoutSession.id },
      });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
