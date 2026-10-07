import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateOrderStatus } from "@/services/order.service";
import { updateOrderStatusSchema } from "@/validators/order.schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse({ ...body, orderId: id });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;
    const order = await updateOrderStatus(id, parsed.data.status as any, userId);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Admin update order status error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order status" },
      { status: 400 }
    );
  }
}
