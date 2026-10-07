import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTopProducts } from "@/services/report.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = request.nextUrl;
    const limit = Number(searchParams.get("limit") || "10");
    const products = await getTopProducts(limit);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch top products" }, { status: 500 });
  }
}
