import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPurchaseOrderById } from "@/services/purchase-order.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const po = await getPurchaseOrderById(id);
    if (!po) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
    }
    return NextResponse.json(po);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch purchase order" }, { status: 500 });
  }
}
