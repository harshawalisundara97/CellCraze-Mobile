"use client";

import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { CategoryCard, type CategoryCardData } from "@/components/storefront/category-card";
import { ProductCard, type ProductCardData } from "@/components/storefront/product-card";
import { formatCurrency } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const categories: CategoryCardData[] = [
  { name: "Phones", slug: "phones", image: null, productCount: 42, index: 1 },
  { name: "Headphones", slug: "headphones", image: null, productCount: 18, index: 2 },
  { name: "Earphones", slug: "earphones", image: null, productCount: 24, index: 3 },
  { name: "Chargers", slug: "chargers", image: null, productCount: 31, index: 4 },
  { name: "Smartwatches", slug: "smartwatches", image: null, productCount: 15, index: 5 },
  { name: "Accessories", slug: "accessories", image: null, productCount: 56, index: 6 },
];

const featuredProducts: ProductCardData[] = [
  { id: "1", name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", brand: "Samsung", price: 499900, compareAtPrice: 549900, stockQuantity: 12, images: [{ url: "/placeholder.png", altText: "Galaxy S25 Ultra" }], categorySlug: "phones" },
  { id: "2", name: "iPhone 16 Pro", slug: "iphone-16-pro", brand: "Apple", price: 524900, compareAtPrice: null, stockQuantity: 8, images: [{ url: "/placeholder.png", altText: "iPhone 16 Pro" }], categorySlug: "phones" },
  { id: "3", name: "WH-1000XM5", slug: "sony-wh-1000xm5", brand: "Sony", price: 89900, compareAtPrice: 109900, stockQuantity: 22, images: [{ url: "/placeholder.png", altText: "Sony WH-1000XM5" }], categorySlug: "headphones" },
  { id: "4", name: "Galaxy Watch 7", slug: "galaxy-watch-7", brand: "Samsung", price: 74900, compareAtPrice: null, stockQuantity: 5, images: [{ url: "/placeholder.png", altText: "Galaxy Watch 7" }], categorySlug: "smartwatches" },
  { id: "5", name: "Pixel 9 Pro", slug: "pixel-9-pro", brand: "Google", price: 389900, compareAtPrice: 419900, stockQuantity: 0, images: [{ url: "/placeholder.png", altText: "Pixel 9 Pro" }], categorySlug: "phones" },
  { id: "6", name: "AirPods Pro 2", slug: "airpods-pro-2", brand: "Apple", price: 64900, compareAtPrice: null, stockQuantity: 30, images: [{ url: "/placeholder.png", altText: "AirPods Pro 2" }], categorySlug: "earphones" },
  { id: "7", name: "Galaxy Buds3 Pro", slug: "galaxy-buds3-pro", brand: "Samsung", price: 49900, compareAtPrice: 54900, stockQuantity: 18, images: [{ url: "/placeholder.png", altText: "Galaxy Buds3 Pro" }], categorySlug: "earphones" },
  { id: "8", name: "65W GaN Charger", slug: "65w-gan-charger", brand: "Anker", price: 12900, compareAtPrice: 14900, stockQuantity: 45, images: [{ url: "/placeholder.png", altText: "Anker 65W GaN" }], categorySlug: "chargers" },
];

const newArrivals = [
  { id: "10", brand: "Samsung", name: "Galaxy S25+", category: "Phones", price: 424900, slug: "galaxy-s25-plus" },
  { id: "11", brand: "Apple", name: "iPhone 16e", category: "Phones", price: 199900, slug: "iphone-16e" },
  { id: "12", brand: "Sony", name: "WF-1000XM5", category: "Earphones", price: 72900, slug: "sony-wf-1000xm5" },
  { id: "13", brand: "Xiaomi", name: "14T Pro", category: "Phones", price: 189900, slug: "xiaomi-14t-pro" },
  { id: "14", brand: "Samsung", name: "Galaxy Fit3", category: "Smartwatches", price: 14900, slug: "galaxy-fit3" },
  { id: "15", brand: "Baseus", name: "100W USB-C Cable", category: "Accessories", price: 2490, slug: "baseus-100w-usbc" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <Box component="section" className="grid grid-cols-2 max-md:grid-cols-1" sx={{ borderBottom: 2, borderColor: "divider" }}>
        {/* Left column */}
        <Box className="flex flex-col justify-center gap-6 px-[80px] pt-10 pb-16 max-md:px-4 max-md:py-10">
          <Typography variant="subtitle2" color="primary">
            New this week — Galaxy S25 series
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "40px", md: "76px" }, lineHeight: 1.02 }}>
            Phones, sound and power.{" "}
            <Box component="span" sx={{ color: "primary.main" }}>In stock today.</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "17px", maxWidth: "44ch", lineHeight: 1.6 }}>
            Sri Lanka&rsquo;s sharpest selection of mobile phones, headphones, chargers
            and accessories. Genuine products, official warranty, island-wide delivery.
          </Typography>
          <Box className="flex gap-3 mt-2">
            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} component={Link} href="/products?category=phones">
              Shop phones
            </Button>
            <Button variant="outlined" size="large" color="secondary" component={Link} href="/products">
              Browse accessories
            </Button>
          </Box>
        </Box>

        {/* Right column — placeholder image well */}
        <Box sx={{ bgcolor: "background.paper", minHeight: 540, filter: "grayscale(1)" }} />
      </Box>

      {/* ---- Shop by Category ---- */}
      <Box component="section">
        <Box className="flex items-baseline justify-between px-[40px] pt-14 pb-5 max-md:px-4">
          <Typography variant="h2" sx={{ fontSize: "32px" }}>Shop by category</Typography>
          <Typography
            component={Link}
            href="/categories"
            variant="body2"
            sx={{ fontSize: "14px", fontWeight: 600, color: "primary.main", "&:hover": { textDecoration: "underline" } }}
          >
            All categories
          </Typography>
        </Box>
        <div className="ruled-grid grid-cols-6 max-md:grid-cols-2 rule-bottom">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </Box>

      {/* ---- Featured ---- */}
      <Box component="section">
        <Box className="flex items-baseline justify-between px-[40px] pt-14 pb-5 max-md:px-4">
          <Typography variant="h2" sx={{ fontSize: "32px" }}>Featured</Typography>
          <Typography
            component={Link}
            href="/products?featured=true"
            variant="body2"
            sx={{ fontSize: "14px", fontWeight: 600, color: "primary.main", "&:hover": { textDecoration: "underline" } }}
          >
            View all
          </Typography>
        </Box>
        <div className="ruled-grid grid-cols-4 max-md:grid-cols-2 rule-bottom">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Box>

      {/* ---- New Arrivals ---- */}
      <Box component="section" className="grid grid-cols-[4fr_8fr] max-md:grid-cols-1" sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Box className="px-[40px] pt-14 pb-10 max-md:px-4">
          <Typography variant="h2" sx={{ fontSize: "32px" }}>New arrivals</Typography>
          <Typography variant="body2" sx={{ mt: 1, maxWidth: "32ch", fontSize: "15px" }}>
            The latest additions to our catalogue, fresh off the shelf.
          </Typography>
        </Box>
        <Box sx={{ borderLeft: { xs: 0, md: 2 }, borderTop: { xs: 2, md: 0 }, borderColor: "divider" }}>
          {newArrivals.map((item, i) => (
            <Box
              key={item.id}
              component={Link}
              href={`/products/${item.slug}`}
              className="flex items-center gap-5 px-5 py-4"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "&:last-child": { borderBottom: 0 },
                "&:hover": { bgcolor: "action.hover" },
                transition: "background-color 0.15s",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "12px", fontVariantNumeric: "tabular-nums", width: 28, color: "text.secondary" }}>
                {String(i + 1).padStart(2, "0")}
              </Typography>
              <Box sx={{ width: 48, height: 48, bgcolor: "background.paper", filter: "grayscale(1)", flexShrink: 0 }} />
              <Box className="flex-1 min-w-0">
                <Typography variant="subtitle2" color="text.secondary">
                  {item.brand}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, fontSize: "15px", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: "12px", flexShrink: 0 }}>{item.category}</Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 800, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                {formatCurrency(item.price)}
              </Typography>
              <ArrowForwardIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* ---- Service Band ---- */}
      <Grid container component="section" sx={{ borderBottom: 2, borderColor: "divider" }}>
        {[
          { icon: LocalShippingIcon, title: "Delivered in 2-4 days", desc: "Island-wide delivery with tracking" },
          { icon: CreditCardIcon, title: "Card, cash or transfer", desc: "Multiple payment methods accepted" },
          { icon: VerifiedUserIcon, title: "Genuine, with warranty", desc: "Official products, manufacturer warranty" },
        ].map(({ icon: Icon, title, desc }) => (
          <Grid key={title} size={{ xs: 12, md: 4 }} sx={{ borderRight: { md: 2 }, borderBottom: { xs: 2, md: 0 }, borderColor: "divider", "&:last-child": { borderRight: 0, borderBottom: 0 } }}>
            <Box className="flex items-start gap-4 px-[40px] py-10 max-md:px-4">
              <Icon sx={{ fontSize: 24, color: "text.primary", mt: "2px", flexShrink: 0 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 800, fontSize: "16px" }}>{title}</Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontSize: "13px" }}>{desc}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
