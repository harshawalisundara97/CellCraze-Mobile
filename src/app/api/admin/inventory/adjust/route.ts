import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adjustStock } from "@/services/inventory.service";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { productId, quantity, type, notes } = await request.json();

    if (!productId || quantity === undefined || !type) {
      return NextResponse.json(
        { error: "productId, quantity, and type are required" },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;
    const product = await adjustStock(productId, quantity, type, userId, notes);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Admin adjust stock error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to adjust stock" },
      { status: 400 }
    );
  }
}
