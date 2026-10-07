import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateInvoiceStatus } from "@/services/invoice.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const { status } = await request.json();
    const invoice = await updateInvoiceStatus(id, status);
    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update invoice status" }, { status: 400 });
  }
}
