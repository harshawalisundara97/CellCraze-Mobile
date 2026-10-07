import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { confirmGRN } from "@/services/grn.service";

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
    const grn = await confirmGRN(id, (session.user as any).id);
    return NextResponse.json(grn);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to confirm GRN" }, { status: 400 });
  }
}
