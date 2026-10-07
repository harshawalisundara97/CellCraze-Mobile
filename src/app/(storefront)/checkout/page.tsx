"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const cartItems = [
  { id: "1", name: "Galaxy S25 Ultra", brand: "Samsung", price: 389900, quantity: 1 },
  { id: "3", name: "Sony WH-1000XM5", brand: "Sony", price: 89900, quantity: 2 },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "COD" | "BANK_TRANSFER">("STRIPE");
  const [address, setAddress] = useState({
    recipientName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 1000000 ? 0 : 50000;
  const total = subtotal + shipping;

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-ink">Cart</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Checkout</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-8">Checkout</h1>

      <div className="grid grid-cols-[1fr_380px] gap-0 max-md:grid-cols-1 rule-bottom">
        <div className="pr-10 pb-10 max-md:pr-0 border-r-2 border-divider max-md:border-r-0">
          <h2 className="text-[20px] mb-6">Delivery address</h2>
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {[
              { label: "Recipient name", field: "recipientName", span: 2 },
              { label: "Phone", field: "phone", span: 1 },
              { label: "Postal code", field: "postalCode", span: 1 },
              { label: "Address line 1", field: "line1", span: 2 },
              { label: "Address line 2", field: "line2", span: 2 },
              { label: "City", field: "city", span: 1 },
              { label: "Province", field: "province", span: 1 },
            ].map(({ label, field, span }) => (
              <div key={field} className={span === 2 ? "col-span-2 max-md:col-span-1" : ""}>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  {label}
                </label>
                <Input value={(address as any)[field]} onChange={update(field)} />
              </div>
            ))}
          </div>

          <h2 className="text-[20px] mt-10 mb-4">Payment method</h2>
          <div className="flex flex-col gap-2">
            {[
              { value: "STRIPE" as const, label: "Credit / Debit Card", desc: "Secure payment via Stripe" },
              { value: "COD" as const, label: "Cash on Delivery", desc: "Pay when you receive" },
              { value: "BANK_TRANSFER" as const, label: "Bank Transfer", desc: "Manual bank transfer" },
            ].map((method) => (
              <label
                key={method.value}
                className={`flex items-center gap-3 px-4 py-3 border-2 cursor-pointer transition-colors ${
                  paymentMethod === method.value ? "border-accent bg-accent-100" : "border-divider hover:bg-ink/[0.02]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value)}
                  className="accent-accent"
                />
                <div>
                  <span className="block text-[14px] font-[800]">{method.label}</span>
                  <span className="block text-[12px] text-muted">{method.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pl-10 pt-0 pb-10 max-md:pl-0 max-md:pt-6">
          <h2 className="text-[20px] mb-6">Order summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-[14px] mb-3">
              <span>
                {item.name} <span className="text-muted">x{item.quantity}</span>
              </span>
              <span className="font-[800] tnum">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-divider pt-3 mt-3">
            <div className="flex justify-between text-[14px] mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="tnum">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[14px] mb-4">
              <span className="text-muted">Shipping</span>
              <span className="tnum">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div className="border-t-2 border-divider pt-4 flex justify-between text-[18px]">
              <span className="font-[800]">Total</span>
              <span className="font-[800] tnum">{formatCurrency(total)}</span>
            </div>
          </div>
          <Button size="lg" block className="mt-6">
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
}
