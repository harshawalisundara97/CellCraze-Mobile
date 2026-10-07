import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProducts, createProduct } from "@/services/product.service";
import { createProductSchema } from "@/validators/product.schema";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") || "1");
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;

    const result = await getProducts(
      { search, categorySlug: category },
      { page, limit: 20 }
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { categoryId, specifications, ...rest } = parsed.data;
    const product = await createProduct({
      ...rest,
      ...(specifications !== undefined && specifications !== null
        ? { specifications: specifications as any }
        : {}),
      category: { connect: { id: categoryId } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Admin create product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
