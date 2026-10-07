import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLowStockProducts } from "@/services/inventory.service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const products = await getLowStockProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin get low stock error:", error);
    return NextResponse.json(
      { error: "Failed to fetch low stock products" },
      { status: 500 }
    );
  }
}
