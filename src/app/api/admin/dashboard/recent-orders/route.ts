import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRecentOrders } from "@/services/report.service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const orders = await getRecentOrders(10);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recent orders" }, { status: 500 });
  }
}
