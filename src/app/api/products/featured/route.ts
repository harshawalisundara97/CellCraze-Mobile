import { NextRequest, NextResponse } from "next/server";
import { getFeaturedProducts } from "@/services/product.service";

export async function GET(_request: NextRequest) {
  try {
    const products = await getFeaturedProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Get featured products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
