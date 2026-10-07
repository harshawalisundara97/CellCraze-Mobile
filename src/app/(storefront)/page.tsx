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
import { useApi } from "@/hooks/use-api";
import {
  type ApiProduct,
  type ApiCategory,
  type ProductListResponse,
  toProductCardData,
} from "@/types/api";

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const { data: featured } = useApi<ApiProduct[]>("/api/products/featured");
  const { data: categoryData } = useApi<ApiCategory[]>("/api/categories");
  const { data: newest } = useApi<ProductListResponse>(
    "/api/products?sort=newest&limit=6",
  );

  const categories: CategoryCardData[] = (categoryData ?? []).map((cat, i) => ({
    name: cat.name,
    slug: cat.slug,
    image: cat.image,
    productCount: cat._count?.products ?? 0,
    index: i + 1,
  }));

  const featuredProducts: ProductCardData[] = (featured ?? []).map(
    toProductCardData,
  );

  const newArrivals = (newest?.products ?? []).map((p) => ({
    id: p.id,
    brand: p.brand ?? "",
    name: p.name,
    category: p.category?.name ?? "",
    price: p.price,
    slug: p.slug,
  }));

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
