import { NextResponse } from "next/server";
import {
  updateCartItemQuantity,
  removeCartItem,
} from "@/services/cart.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { quantity } = await request.json();

    if (quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { error: "Valid quantity is required" },
        { status: 400 }
      );
    }

    const item = await updateCartItemQuantity(id, quantity);
    return NextResponse.json(item);
  } catch (error: any) {
    console.error("Update cart item error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart item" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await removeCartItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove cart item error:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
