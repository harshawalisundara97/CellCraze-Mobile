import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInventoryTransactions } from "@/services/inventory.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId") || undefined;
    const type = searchParams.get("type") as any || undefined;
    const page = Number(searchParams.get("page") || "1");

    const result = await getInventoryTransactions(productId, type, page);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin get inventory transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory transactions" },
      { status: 500 }
    );
  }
}
