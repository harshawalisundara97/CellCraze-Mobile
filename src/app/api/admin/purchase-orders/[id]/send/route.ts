import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendPurchaseOrder } from "@/services/purchase-order.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const po = await sendPurchaseOrder(id);
    return NextResponse.json(po);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send PO" }, { status: 400 });
  }
}
