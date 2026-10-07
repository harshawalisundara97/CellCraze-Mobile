"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
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
    <Suspense fallback={<Typography color="text.secondary" className="px-[40px] py-10">Loading products...</Typography>}>
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
    <Box className="px-[40px] max-md:px-4">
      {/* Breadcrumb */}
      <Box component="nav" className="py-3">
        <Typography variant="body2" component="span" sx={{ fontSize: "13px" }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
          <span className="mx-2">/</span>
          <Typography component="span" sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>Products</Typography>
        </Typography>
      </Box>

      {/* Title row */}
      <Box className="flex items-baseline justify-between pb-6" sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Box className="flex items-baseline gap-3">
          <Typography variant="h1" sx={{ fontSize: { xs: "36px", md: "56px" } }}>Products</Typography>
          <Typography variant="body2" sx={{ fontSize: "15px" }}>{filtered.length} items</Typography>
        </Box>
        <SegmentedControl
          options={sortOptions}
          value={sort}
          onChange={setSort}
          name="sort"
        />
      </Box>

      {/* Body grid */}
      <Box className="grid grid-cols-[280px_1fr] gap-0 max-md:grid-cols-1 mt-0">
        {/* Sidebar */}
        <Box component="aside" sx={{ borderRight: { xs: 0, md: 2 }, borderColor: "divider" }} className="pr-5 pt-6 pb-10 max-md:pr-0 max-md:pb-6">
          {/* Category tree */}
          <Box sx={{ pb: 2.5, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Category
            </Typography>
            <Box className="flex flex-col gap-1">
              {categoryTree.map((cat) => (
                <Button
                  key={cat.slug}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.slug ? null : cat.slug,
                    )
                  }
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    fontWeight: selectedCategory === cat.slug ? 800 : 400,
                    color: selectedCategory === cat.slug ? "primary.main" : "text.primary",
                    fontSize: "14px",
                    py: 0.5,
                    px: 0,
                    minWidth: 0,
                    "&:hover": { color: "primary.main", bgcolor: "transparent" },
                  }}
                  fullWidth
                  disableRipple
                >
                  <span>{cat.label}</span>
                  <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums", fontSize: "14px" }}>{cat.count}</Typography>
                </Button>
              ))}
            </Box>
          </Box>

          {/* Brands */}
          <Box sx={{ py: 2.5, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Brand
            </Typography>
            <Box className="flex flex-col gap-1">
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      size="small"
                      color="primary"
                    />
                  }
                  label={<Typography sx={{ fontSize: "14px" }}>{brand}</Typography>}
                  sx={{ ml: 0 }}
                />
              ))}
            </Box>
          </Box>

          {/* Price */}
          <Box sx={{ py: 2.5, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Price (Rs)
            </Typography>
            <Box className="flex gap-2">
              <TextField
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                size="small"
                fullWidth
              />
            </Box>
          </Box>

          {/* In stock */}
          <Box sx={{ py: 2.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inStockOnly}
                  onChange={() => setInStockOnly(!inStockOnly)}
                  size="small"
                  color="primary"
                />
              }
              label={<Typography sx={{ fontSize: "14px" }}>In stock only</Typography>}
              sx={{ ml: 0 }}
            />
          </Box>
        </Box>

        {/* Main */}
        <Box className="pl-0 pt-6 max-md:pt-6">
          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <Box className="flex flex-wrap gap-2 mb-5 pl-5 max-md:pl-0">
              {activeFilters.map((f) => (
                <Chip
                  key={f.label}
                  label={f.label}
                  onDelete={f.clear}
                  size="small"
                  variant="filled"
                />
              ))}
              {activeFilters.length > 1 && (
                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrands([]);
                    setInStockOnly(false);
                    setPriceMin("");
                    setPriceMax("");
                  }}
                  sx={{ fontSize: "12px", fontWeight: 600, color: "primary.main", textTransform: "none", p: 0, minWidth: 0, "&:hover": { textDecoration: "underline", bgcolor: "transparent" } }}
                  disableRipple
                >
                  Clear all
                </Button>
              )}
            </Box>
          )}

          {/* Product grid */}
          <div className="ruled-grid grid-cols-3 max-md:grid-cols-2">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          <Box className="flex items-center justify-between py-6 px-5" sx={{ borderTop: 2, borderColor: "divider" }}>
            <Typography variant="body2" sx={{ fontSize: "13px" }}>
              Showing {filtered.length} of {allProducts.length} products
            </Typography>
            <Box className="flex gap-1">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "contained" : "text"}
                  color={page === 1 ? "primary" : "inherit"}
                  sx={{ minWidth: 36, height: 36, fontSize: "13px", fontWeight: 600, px: 0 }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
