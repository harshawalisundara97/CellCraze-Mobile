import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInvoices } from "@/services/invoice.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") || "1");
    const status = searchParams.get("status") || undefined;
    const result = await getInvoices(page, 20, status as any);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
