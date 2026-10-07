"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";

const mockCategories = [
  { id: "cat-1", name: "Phones" },
  { id: "cat-2", name: "Headphones" },
  { id: "cat-3", name: "Earphones" },
  { id: "cat-4", name: "Chargers" },
  { id: "cat-5", name: "Smartwatches" },
  { id: "cat-6", name: "Accessories" },
];

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");
  const [reorderQty, setReorderQty] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const labelClass =
    "block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-1";

  const selectClass =
    "min-h-[36px] w-full rounded-none border border-divider bg-surface px-[10px] py-[6px] text-[14px] text-ink font-sans transition-colors duration-100 hover:border-ink/[0.45] focus:border-accent focus:outline-none";

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-[14px] text-accent hover:underline mb-6"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <h1 className="text-[32px] font-[800] mb-8">New Product</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Left: Main Fields */}
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Product Name</label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Galaxy S25 Ultra"
            />
          </div>

          <div>
            <label className={labelClass}>Slug</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-name"
            />
          </div>

          <div>
            <label className={labelClass}>SKU</label>
            <Input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. SM-S938B-256"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Brand</label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Samsung"
              />
            </div>
            <div>
              <label className={labelClass}>Model</label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. SM-S938B"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              className={selectClass}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {mockCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Weight (g)</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 232"
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className="min-h-[120px] w-full rounded-none border border-divider bg-surface px-[10px] py-[6px] text-[14px] text-ink font-sans transition-colors duration-100 hover:border-ink/[0.45] focus:border-accent focus:outline-none resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description..."
            />
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass}>Specifications</label>
              <Button variant="ghost" size="default" onClick={addSpec} leadingIcon={<Plus size={14} />}>
                Add spec
              </Button>
            </div>
            {specs.length > 0 && (
              <div className="space-y-2">
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      placeholder="Key"
                      value={spec.key}
                      onChange={(e) => updateSpec(i, "key", e.target.value)}
                    />
                    <Input
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                    />
                    <Button
                      variant="icon"
                      size="icon"
                      onClick={() => removeSpec(i)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Pricing, Inventory, Status */}
        <div className="space-y-6">
          {/* Pricing */}
          <div>
            <h2 className="text-[20px] font-[800] mb-4">Pricing</h2>
            <div className="border-t-2 border-divider pt-4 space-y-4">
              <div>
                <label className={labelClass}>Price (cents)</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 389900"
                />
              </div>
              <div>
                <label className={labelClass}>Compare At Price (cents)</label>
                <Input
                  type="number"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="e.g. 449900"
                />
              </div>
              <div>
                <label className={labelClass}>Cost Price (cents)</label>
                <Input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="e.g. 280000"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h2 className="text-[20px] font-[800] mb-4">Inventory</h2>
            <div className="border-t-2 border-divider pt-4 space-y-4">
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <Input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="e.g. 25"
                />
              </div>
              <div>
                <label className={labelClass}>Reorder Point</label>
                <Input
                  type="number"
                  value={reorderPoint}
                  onChange={(e) => setReorderPoint(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className={labelClass}>Reorder Quantity</label>
                <Input
                  type="number"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(e.target.value)}
                  placeholder="e.g. 20"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h2 className="text-[20px] font-[800] mb-4">Status</h2>
            <div className="border-t-2 border-divider pt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer text-[14px]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded-none border-divider accent-accent"
                />
                Active
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-[14px]">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded-none border-divider accent-accent"
                />
                Featured
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t-2 border-divider pt-6">
        <Button size="lg" leadingIcon={<Save size={18} />}>
          Save Product
        </Button>
      </div>
    </div>
  );
}
