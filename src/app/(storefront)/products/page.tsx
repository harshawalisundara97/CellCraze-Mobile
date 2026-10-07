"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const allProducts: ProductCardData[] = [
  { id: "1", name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", brand: "Samsung", price: 499900, compareAtPrice: 549900, stockQuantity: 12, images: [{ url: "/placeholder.png", altText: "Galaxy S25 Ultra" }], categorySlug: "phones" },
  { id: "2", name: "iPhone 16 Pro", slug: "iphone-16-pro", brand: "Apple", price: 524900, compareAtPrice: null, stockQuantity: 8, images: [{ url: "/placeholder.png", altText: "iPhone 16 Pro" }], categorySlug: "phones" },
  { id: "3", name: "WH-1000XM5", slug: "sony-wh-1000xm5", brand: "Sony", price: 89900, compareAtPrice: 109900, stockQuantity: 22, images: [{ url: "/placeholder.png", altText: "Sony WH-1000XM5" }], categorySlug: "headphones" },
  { id: "4", name: "Galaxy Watch 7", slug: "galaxy-watch-7", brand: "Samsung", price: 74900, compareAtPrice: null, stockQuantity: 5, images: [{ url: "/placeholder.png", altText: "Galaxy Watch 7" }], categorySlug: "smartwatches" },
  { id: "5", name: "Pixel 9 Pro", slug: "pixel-9-pro", brand: "Google", price: 389900, compareAtPrice: 419900, stockQuantity: 0, images: [{ url: "/placeholder.png", altText: "Pixel 9 Pro" }], categorySlug: "phones" },
  { id: "6", name: "AirPods Pro 2", slug: "airpods-pro-2", brand: "Apple", price: 64900, compareAtPrice: null, stockQuantity: 30, images: [{ url: "/placeholder.png", altText: "AirPods Pro 2" }], categorySlug: "earphones" },
  { id: "7", name: "Galaxy Buds3 Pro", slug: "galaxy-buds3-pro", brand: "Samsung", price: 49900, compareAtPrice: 54900, stockQuantity: 18, images: [{ url: "/placeholder.png", altText: "Galaxy Buds3 Pro" }], categorySlug: "earphones" },
  { id: "8", name: "65W GaN Charger", slug: "65w-gan-charger", brand: "Anker", price: 12900, compareAtPrice: 14900, stockQuantity: 45, images: [{ url: "/placeholder.png", altText: "Anker 65W GaN" }], categorySlug: "chargers" },
  { id: "9", name: "Galaxy S25+", slug: "galaxy-s25-plus", brand: "Samsung", price: 424900, compareAtPrice: null, stockQuantity: 15, images: [{ url: "/placeholder.png", altText: "Galaxy S25+" }], categorySlug: "phones" },
  { id: "10", name: "iPhone 16e", slug: "iphone-16e", brand: "Apple", price: 199900, compareAtPrice: null, stockQuantity: 20, images: [{ url: "/placeholder.png", altText: "iPhone 16e" }], categorySlug: "phones" },
  { id: "11", name: "Xiaomi 14T Pro", slug: "xiaomi-14t-pro", brand: "Xiaomi", price: 189900, compareAtPrice: 209900, stockQuantity: 10, images: [{ url: "/placeholder.png", altText: "Xiaomi 14T Pro" }], categorySlug: "phones" },
  { id: "12", name: "Galaxy Fit3", slug: "galaxy-fit3", brand: "Samsung", price: 14900, compareAtPrice: null, stockQuantity: 35, images: [{ url: "/placeholder.png", altText: "Galaxy Fit3" }], categorySlug: "smartwatches" },
];

const categoryTree = [
  { slug: "phones", label: "Phones", count: 6 },
  { slug: "headphones", label: "Headphones", count: 1 },
  { slug: "earphones", label: "Earphones", count: 2 },
  { slug: "chargers", label: "Chargers", count: 1 },
  { slug: "smartwatches", label: "Smartwatches", count: 2 },
  { slug: "accessories", label: "Accessories", count: 0 },
];

const brands = ["Samsung", "Apple", "Sony", "Google", "Anker", "Xiaomi"];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price low", value: "price-asc" },
  { label: "Price high", value: "price-desc" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="px-[40px] py-10 text-muted">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category"),
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand"),
  );
  const [priceMin, setPriceMin] = useState(searchParams.get("minPrice") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("maxPrice") ?? "");
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStock") === "true",
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (selectedCategory) list = list.filter((p) => p.categorySlug === selectedCategory);
    if (selectedBrands.length > 0)
      list = list.filter((p) => p.brand && selectedBrands.includes(p.brand));
    if (priceMin) list = list.filter((p) => p.price >= Number(priceMin) * 100);
    if (priceMax) list = list.filter((p) => p.price <= Number(priceMax) * 100);
    if (inStockOnly) list = list.filter((p) => p.stockQuantity > 0);

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [selectedCategory, selectedBrands, priceMin, priceMax, inStockOnly, sort]);

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (selectedCategory)
    activeFilters.push({
      label: categoryTree.find((c) => c.slug === selectedCategory)?.label ?? selectedCategory,
      clear: () => setSelectedCategory(null),
    });
  selectedBrands.forEach((b) =>
    activeFilters.push({ label: b, clear: () => toggleBrand(b) }),
  );
  if (inStockOnly)
    activeFilters.push({ label: "In stock", clear: () => setInStockOnly(false) });

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      {/* Breadcrumb */}
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Products</span>
      </nav>

      {/* Title row */}
      <div className="flex items-baseline justify-between pb-6 rule-bottom">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[56px] max-md:text-[36px]">Products</h1>
          <span className="text-[15px] text-muted">{filtered.length} items</span>
        </div>
        <SegmentedControl
          options={sortOptions}
          value={sort}
          onChange={setSort}
          name="sort"
        />
      </div>

      {/* Body grid */}
      <div className="grid grid-cols-[280px_1fr] gap-0 max-md:grid-cols-1 mt-0">
        {/* Sidebar */}
        <aside className="border-r-2 border-divider pr-5 pt-6 pb-10 max-md:border-r-0 max-md:border-b-2 max-md:pb-6 max-md:pr-0">
          {/* Category tree */}
          <div className="pb-5 border-b-2 border-divider">
            <h3 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-3">
              Category
            </h3>
            <ul className="flex flex-col gap-1">
              {categoryTree.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.slug ? null : cat.slug,
                      )
                    }
                    className={`w-full text-left text-[14px] py-1 flex justify-between ${
                      selectedCategory === cat.slug
                        ? "font-[800] text-accent"
                        : "text-ink hover:text-accent"
                    } transition-colors`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-muted tnum">{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div className="py-5 border-b-2 border-divider">
            <h3 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-3">
              Brand
            </h3>
            <ul className="flex flex-col gap-2">
              {brands.map((brand) => (
                <li key={brand}>
                  <label className="flex items-center gap-2 text-[14px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="accent-accent"
                    />
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="py-5 border-b-2 border-divider">
            <h3 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-3">
              Price (Rs)
            </h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* In stock */}
          <div className="py-5">
            <label className="flex items-center gap-2 text-[14px] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly(!inStockOnly)}
                className="accent-accent"
              />
              In stock only
            </label>
          </div>
        </aside>

        {/* Main */}
        <div className="pl-0 pt-6 max-md:pt-6">
          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5 pl-5 max-md:pl-0">
              {activeFilters.map((f) => (
                <button
                  key={f.label}
                  onClick={f.clear}
                  className="inline-flex items-center gap-1 bg-surface px-3 py-[5px] text-[12px] font-semibold text-ink hover:bg-neutral-300 transition-colors"
                >
                  {f.label}
                  <X size={12} />
                </button>
              ))}
              {activeFilters.length > 1 && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrands([]);
                    setInStockOnly(false);
                    setPriceMin("");
                    setPriceMax("");
                  }}
                  className="text-[12px] font-semibold text-accent hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          )}

          {/* Product grid */}
          <div className="ruled-grid grid-cols-3 max-md:grid-cols-2">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-6 px-5 rule-top mt-0">
            <span className="text-[13px] text-muted">
              Showing {filtered.length} of {allProducts.length} products
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`min-w-[36px] h-[36px] flex items-center justify-center text-[13px] font-semibold ${
                    page === 1 ? "bg-accent text-bg" : "hover:bg-ink/[0.05] text-ink"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
