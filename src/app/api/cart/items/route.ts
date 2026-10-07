import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrCreateCart, addToCart } from "@/services/cart.service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user ? (session.user as any).id : undefined;
    const sessionId = request.cookies.get("cart-session")?.value;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: "No cart session found" },
        { status: 400 }
      );
    }

    const cart = await getOrCreateCart(userId, sessionId);
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const item = await addToCart(cart.id, productId, quantity);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add item to cart" },
      { status: 400 }
    );
  }
}
