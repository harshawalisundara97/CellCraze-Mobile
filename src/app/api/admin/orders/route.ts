import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllOrders } from "@/services/order.service";

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
    const page = Number(searchParams.get("page") || "1");
    const status = searchParams.get("status") as any || undefined;
    const search = searchParams.get("search") || undefined;

    const result = await getAllOrders(page, 20, status, search);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
