import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cancelOrder } from "@/services/order.service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;
    const order = await cancelOrder(id, userId);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel order" },
      { status: 400 }
    );
  }
}
