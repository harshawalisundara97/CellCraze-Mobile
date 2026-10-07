import { NextRequest, NextResponse } from "next/server";
import { getCategoriesWithProductCount } from "@/services/category.service";

export async function GET(_request: NextRequest) {
  try {
    const categories = await getCategoriesWithProductCount();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
