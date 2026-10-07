"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import { StockIndicator } from "@/components/ui/stock-indicator";
import { formatCurrency } from "@/lib/utils";

const products = [
  { id: "1", sku: "SM-S938B-256", name: "Galaxy S25 Ultra", brand: "Samsung", category: "Phones", price: 389900, stockQuantity: 12, isActive: true, isFeatured: true },
  { id: "2", sku: "IP16P-256", name: "iPhone 16 Pro", brand: "Apple", category: "Phones", price: 449900, stockQuantity: 15, isActive: true, isFeatured: true },
  { id: "3", sku: "SONY-WH1000XM5", name: "Sony WH-1000XM5", brand: "Sony", category: "Headphones", price: 89900, stockQuantity: 18, isActive: true, isFeatured: true },
  { id: "4", sku: "SGE-BUDS3P", name: "Galaxy Buds3 Pro", brand: "Samsung", category: "Earphones", price: 59900, stockQuantity: 0, isActive: true, isFeatured: false },
  { id: "5", sku: "ANK-737", name: "Anker 737 Power Bank", brand: "Anker", category: "Chargers", price: 34900, stockQuantity: 25, isActive: true, isFeatured: true },
  { id: "6", sku: "AW-S10", name: "Apple Watch Series 10", brand: "Apple", category: "Smartwatches", price: 129900, stockQuantity: 10, isActive: true, isFeatured: true },
  { id: "7", sku: "SGW-U7", name: "Galaxy Watch Ultra", brand: "Samsung", category: "Smartwatches", price: 159900, stockQuantity: 3, isActive: true, isFeatured: false },
  { id: "8", sku: "SPG-ULTRA", name: "Spigen Ultra Hybrid Case", brand: "Spigen", category: "Accessories", price: 4900, stockQuantity: 50, isActive: true, isFeatured: false },
];

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px]">Products</h1>
          <p className="text-[14px] text-muted">{products.length} products</p>
        </div>
        <Button leadingIcon={<Plus size={16} />}>Add product</Button>
      </div>

      <div className="mb-6 max-w-[320px]">
        <Input
          variant="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border-t-2 border-divider">
        <div className="grid grid-cols-[100px_1fr_100px_100px_120px_80px_80px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
          <span>SKU</span>
          <span>Product</span>
          <span>Category</span>
          <span>Brand</span>
          <span className="text-right">Price</span>
          <span className="text-center">Stock</span>
          <span className="text-center">Status</span>
        </div>
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}`}
            className="grid grid-cols-[100px_1fr_100px_100px_120px_80px_80px] gap-4 items-center py-3 border-b border-divider text-[14px] hover:bg-ink/[0.02] transition-colors"
          >
            <span className="tnum text-muted">{product.sku}</span>
            <span className="font-[800] truncate">{product.name}</span>
            <span className="text-muted">{product.category}</span>
            <span className="text-muted">{product.brand}</span>
            <span className="text-right tnum font-[800]">{formatCurrency(product.price)}</span>
            <span className="flex items-center justify-center gap-2">
              <StockIndicator quantity={product.stockQuantity} />
              <span className="tnum">{product.stockQuantity}</span>
            </span>
            <span className="flex justify-center">
              {product.isFeatured && <Tag variant="accent">Featured</Tag>}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
