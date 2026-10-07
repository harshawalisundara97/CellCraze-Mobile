"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  parentId: string | null;
}

const initialCategories: Category[] = [
  { id: "cat-1", name: "Phones", slug: "phones", productCount: 14, parentId: null },
  { id: "cat-2", name: "Headphones", slug: "headphones", productCount: 8, parentId: null },
  { id: "cat-3", name: "Earphones", slug: "earphones", productCount: 6, parentId: null },
  { id: "cat-4", name: "Chargers", slug: "chargers", productCount: 10, parentId: null },
  { id: "cat-5", name: "Smartwatches", slug: "smartwatches", productCount: 5, parentId: null },
  { id: "cat-6", name: "Accessories", slug: "accessories", productCount: 22, parentId: null },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: newName.trim(),
      slug: slugify(newName.trim()),
      productCount: 0,
      parentId: null,
    };
    setCategories([...categories, cat]);
    setNewName("");
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-[800]">Categories</h1>
          <p className="text-[14px] text-muted">{categories.length} categories</p>
        </div>
      </div>

      <div className="border-t-2 border-divider">
        <div className="grid grid-cols-[1fr_160px_100px_80px] gap-4 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 border-b-2 border-divider">
          <span>Name</span>
          <span>Slug</span>
          <span className="text-center">Products</span>
          <span className="text-right">Actions</span>
        </div>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="grid grid-cols-[1fr_160px_100px_80px] gap-4 items-center py-3 border-b border-divider text-[14px] hover:bg-ink/[0.02] transition-colors"
          >
            <span className="font-[800]">{cat.name}</span>
            <span className="tnum text-muted">{cat.slug}</span>
            <span className="text-center tnum text-muted">{cat.productCount}</span>
            <div className="flex items-center justify-end gap-1">
              <Button variant="icon" size="icon">
                <Edit size={16} />
              </Button>
              <Button variant="icon" size="icon" onClick={() => handleDelete(cat.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Form */}
      <div className="mt-6 border-t-2 border-divider pt-6">
        <h2 className="text-[20px] font-[800] mb-4">Add Category</h2>
        <div className="flex gap-3 items-end max-w-[480px]">
          <div className="flex-1">
            <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-1">
              Category Name
            </label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Tablets"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <Button leadingIcon={<Plus size={16} />} onClick={handleCreate}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
