import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSalesChartData } from "@/services/report.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = request.nextUrl;
    const days = Number(searchParams.get("days") || "30");
    const data = await getSalesChartData(days);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales chart data" }, { status: 500 });
  }
}
