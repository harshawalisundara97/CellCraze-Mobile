"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const suppliers = [
  { id: "1", name: "MobiTech Distributors", contactPerson: "Amal Silva", email: "amal@mobitech.lk", phone: "+94112345678", address: "45 Vauxhall Street, Colombo 02", isActive: true, poCount: 12 },
  { id: "2", name: "DigiWorld Imports", contactPerson: "Priya Jayasuriya", email: "priya@digiworld.lk", phone: "+94112987654", address: "12 Duplication Road, Colombo 04", isActive: true, poCount: 8 },
  { id: "3", name: "TechHub Lanka", contactPerson: "Ruwan Bandara", email: "ruwan@techhub.lk", phone: "+94113456789", address: "78 Galle Road, Mount Lavinia", isActive: true, poCount: 5 },
];

export default function AdminSuppliersPage() {
  const [search, setSearch] = useState("");
  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.contactPerson.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px]">Suppliers</h1>
          <p className="text-[14px] text-muted">{suppliers.length} suppliers</p>
        </div>
        <Button leadingIcon={<Plus size={16} />}>Add supplier</Button>
      </div>

      <div className="mb-6 max-w-[320px]">
        <Input variant="search" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border-t-2 border-divider">
        <div className="grid grid-cols-[1fr_150px_200px_140px_60px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
          <span>Company</span>
          <span>Contact</span>
          <span>Email</span>
          <span>Phone</span>
          <span className="text-center">POs</span>
        </div>
        {filtered.map((supplier) => (
          <div key={supplier.id} className="grid grid-cols-[1fr_150px_200px_140px_60px] gap-4 items-center py-4 border-b border-divider text-[14px] hover:bg-ink/[0.02] cursor-pointer transition-colors">
            <div>
              <span className="block font-[800]">{supplier.name}</span>
              <span className="block text-[12px] text-muted truncate">{supplier.address}</span>
            </div>
            <span>{supplier.contactPerson}</span>
            <span className="text-muted truncate">{supplier.email}</span>
            <span className="tnum text-muted">{supplier.phone}</span>
            <span className="text-center tnum font-[800]">{supplier.poCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
