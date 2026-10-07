import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getPurchaseOrders,
  createPurchaseOrder,
} from "@/services/purchase-order.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") || "1");
    const status = searchParams.get("status") || undefined;
    const result = await getPurchaseOrders(page, 20, status as any);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const po = await createPurchaseOrder(
      body.supplierId,
      body.lines,
      (session.user as any).id,
      body.notes
    );
    return NextResponse.json(po, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create PO" }, { status: 400 });
  }
}
