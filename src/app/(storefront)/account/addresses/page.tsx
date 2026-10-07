"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";

interface Address {
  id: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    recipientName: "Kasun Perera",
    phone: "+94 77 123 4567",
    line1: "42 Galle Road",
    line2: "Apt 3B",
    city: "Colombo 03",
    province: "Western",
    postalCode: "00300",
    isDefault: true,
  },
  {
    id: "2",
    recipientName: "Kasun Perera",
    phone: "+94 77 123 4567",
    line1: "15 Kandy Road",
    line2: "",
    city: "Kadawatha",
    province: "Western",
    postalCode: "11850",
    isDefault: false,
  },
  {
    id: "3",
    recipientName: "Nimal Silva",
    phone: "+94 71 987 6543",
    line1: "8 Temple Street",
    line2: "2nd Floor",
    city: "Kandy",
    province: "Central",
    postalCode: "20000",
    isDefault: false,
  },
];

const emptyForm = {
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  province: "",
  postalCode: "",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      id: String(Date.now()),
      ...form,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, newAddress]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/account" className="hover:text-ink">Account</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Addresses</span>
      </nav>

      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="text-[56px] max-md:text-[36px] mb-2">Addresses</h1>
          <p className="text-[15px] text-muted">{addresses.length} saved addresses</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Address"}
        </Button>
      </div>

      {/* Address list */}
      <div className="flex flex-col">
        {addresses.map((address) => (
          <div key={address.id} className="rule-top pt-5 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[15px] font-[800]">{address.recipientName}</span>
                  {address.isDefault && <Tag variant="accent">Default</Tag>}
                </div>
                <p className="text-[14px] text-muted mb-1">{address.phone}</p>
                <p className="text-[14px]">
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                </p>
                <p className="text-[14px]">
                  {address.city}, {address.province} {address.postalCode}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon">
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(address.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add address form */}
      {showForm && (
        <div className="rule-top pt-8 mt-4">
          <h2 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-5">
            New Address
          </h2>
          <form onSubmit={handleAdd} className="max-w-[640px] flex flex-col gap-4">
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Recipient name
                </label>
                <Input
                  type="text"
                  value={form.recipientName}
                  onChange={update("recipientName")}
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+94 77 123 4567"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                Address line 1
              </label>
              <Input
                type="text"
                value={form.line1}
                onChange={update("line1")}
                placeholder="Street address"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                Address line 2
              </label>
              <Input
                type="text"
                value={form.line2}
                onChange={update("line2")}
                placeholder="Apt, suite, floor (optional)"
              />
            </div>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  value={form.city}
                  onChange={update("city")}
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Province
                </label>
                <Input
                  type="text"
                  value={form.province}
                  onChange={update("province")}
                  placeholder="Province"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Postal code
                </label>
                <Input
                  type="text"
                  value={form.postalCode}
                  onChange={update("postalCode")}
                  placeholder="00000"
                  required
                />
              </div>
            </div>
            <div className="pt-2">
              <Button size="lg" type="submit">
                Save address
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
