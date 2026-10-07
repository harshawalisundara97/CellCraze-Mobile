import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInventoryValue } from "@/services/report.service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const data = await getInventoryValue();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory value" }, { status: 500 });
  }
}
