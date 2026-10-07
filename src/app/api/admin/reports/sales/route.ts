import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSalesReport } from "@/services/report.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = request.nextUrl;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const result = await getSalesReport(
      startDate ? new Date(startDate) : new Date(Date.now() - 30 * 86400000),
      endDate ? new Date(endDate) : new Date()
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales report" }, { status: 500 });
  }
}
