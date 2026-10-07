"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface CartLineItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  stockQuantity: number;
}

const initialItems: CartLineItem[] = [
  { id: "1", name: "Galaxy S25 Ultra", brand: "Samsung", price: 389900, quantity: 1, stockQuantity: 12 },
  { id: "3", name: "Sony WH-1000XM5", brand: "Sony", price: 89900, quantity: 2, stockQuantity: 18 },
];

export default function CartPage() {
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.stockQuantity, item.quantity + delta)) }
          : item
      )
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 1000000 ? 0 : 50000;
  const total = subtotal + shipping;

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Cart</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-2">Cart</h1>
      <p className="text-[15px] text-muted mb-8">{items.length} item{items.length !== 1 ? "s" : ""}</p>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[17px] text-muted mb-6">Your cart is empty.</p>
          <Link href="/products">
            <Button size="lg" trailingIcon={<ArrowRight size={18} />}>
              Browse products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_380px] gap-0 max-md:grid-cols-1">
          <div className="border-t-2 border-divider">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-5 py-5 border-b border-divider">
                <div className="w-[80px] h-[80px] bg-surface grayscale shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-[0.06em] text-ink/60">
                    {item.brand}
                  </span>
                  <span className="block text-[16px] font-[800] truncate">{item.name}</span>
                  <span className="block text-[15px] tnum mt-1">{formatCurrency(item.price)}</span>
                </div>
                <div className="flex items-center border-2 border-divider shrink-0">
                  <button onClick={() => updateQty(item.id, -1)} className="w-[36px] h-[36px] flex items-center justify-center hover:bg-ink/[0.05]">
                    <Minus size={14} />
                  </button>
                  <span className="w-[36px] h-[36px] flex items-center justify-center text-[14px] font-[800] tnum border-x-2 border-divider">
                    {item.quantity}
                  </span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-[36px] h-[36px] flex items-center justify-center hover:bg-ink/[0.05]">
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-[16px] font-[800] tnum w-[120px] text-right shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <button onClick={() => remove(item.id)} className="text-ink/40 hover:text-accent shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-l-2 border-divider pl-10 pt-6 pb-10 max-md:border-l-0 max-md:border-t-2 max-md:pl-0 max-md:pt-6">
            <h2 className="text-[20px] mb-6">Order summary</h2>
            <div className="flex justify-between text-[14px] mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="font-[800] tnum">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[14px] mb-4">
              <span className="text-muted">Shipping</span>
              <span className="font-[800] tnum">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div className="border-t-2 border-divider pt-4 flex justify-between text-[18px]">
              <span className="font-[800]">Total</span>
              <span className="font-[800] tnum">{formatCurrency(total)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-[12px] text-muted mt-2">
                Free shipping on orders over Rs 10,000
              </p>
            )}
            <Link href="/checkout" className="block mt-6">
              <Button size="lg" block trailingIcon={<ArrowRight size={18} />}>
                Proceed to checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
