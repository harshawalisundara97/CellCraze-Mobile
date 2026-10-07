import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/services/product.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const filters = {
      categorySlug: searchParams.get("category") || undefined,
      brands: searchParams.get("brands")?.split(",").filter(Boolean) || undefined,
      priceMin: searchParams.get("priceMin")
        ? Number(searchParams.get("priceMin"))
        : undefined,
      priceMax: searchParams.get("priceMax")
        ? Number(searchParams.get("priceMax"))
        : undefined,
      inStockOnly: searchParams.get("inStockOnly") === "true" || undefined,
      search: searchParams.get("search") || undefined,
    };

    const pagination = {
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
      sort: (searchParams.get("sort") as any) || "featured",
    };

    const result = await getProducts(filters, pagination);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
