import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrCreateCart } from "@/services/cart.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user ? (session.user as any).id : undefined;
    const sessionId = request.cookies.get("cart-session")?.value;

    if (!userId && !sessionId) {
      return NextResponse.json({ items: [] });
    }

    const cart = await getOrCreateCart(userId, sessionId);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
