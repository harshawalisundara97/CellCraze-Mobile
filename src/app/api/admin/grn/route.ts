import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGRNs, createGRN } from "@/services/grn.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") || "1");
    const result = await getGRNs(page, 20);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch GRNs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const grn = await createGRN(
      body.purchaseOrderId,
      new Date(body.receivedDate),
      body.lines,
      (session.user as any).id,
      body.notes
    );
    return NextResponse.json(grn, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create GRN" }, { status: 400 });
  }
}
