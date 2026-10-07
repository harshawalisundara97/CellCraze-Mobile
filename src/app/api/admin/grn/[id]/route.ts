import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGRNById } from "@/services/grn.service";

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
    const grn = await getGRNById(id);
    if (!grn) {
      return NextResponse.json({ error: "GRN not found" }, { status: 404 });
    }
    return NextResponse.json(grn);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch GRN" }, { status: 500 });
  }
}
