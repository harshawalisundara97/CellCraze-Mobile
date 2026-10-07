"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { formatCurrency, getStockStatus } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  images: { url: string; altText: string | null }[];
  categorySlug: string;
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const stock = getStockStatus(product.stockQuantity);
  const primaryImage = product.images[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : null;

  const stockDotColor =
    stock.color === "accent"
      ? "primary.main"
      : stock.color === "neutral-400"
        ? "grey.400"
        : "text.primary";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Image area */}
      <Box sx={{ position: "relative" }}>
        <Link href={`/products/${product.slug}`}>
          <CardMedia
            sx={{
              aspectRatio: "1/1",
              bgcolor: "background.default",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.name}
                fill
                className="object-contain grayscale"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <Box sx={{ width: "100%", height: "100%", bgcolor: "background.default" }} />
            )}
          </CardMedia>
        </Link>
        {discount && (
          <Chip
            label={`-${discount}%`}
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 22,
              fontWeight: 800,
              fontSize: 11,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5, pb: 0 }}>
        {/* Brand + name */}
        <Box>
          {product.brand && (
            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary", mb: 0.25, fontSize: 11 }}
            >
              {product.brand}
            </Typography>
          )}
          <Typography
            component={Link}
            href={`/products/${product.slug}`}
            sx={{
              display: "block",
              fontSize: 16,
              fontWeight: 800,
              lineHeight: 1.25,
              color: "text.primary",
              textDecoration: "none",
              "&:hover": { color: "primary.main" },
              transition: "color 0.2s",
            }}
          >
            {product.name}
          </Typography>
        </Box>

        {/* Prices */}
        <Box className="flex items-baseline gap-2">
          <Typography sx={{ fontSize: 19, fontWeight: 800, color: "text.primary" }}>
            {formatCurrency(product.price)}
          </Typography>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                textDecoration: "line-through",
              }}
            >
              {formatCurrency(product.compareAtPrice)}
            </Typography>
          )}
        </Box>

        {/* Stock indicator */}
        <Box className="flex items-center gap-[6px]">
          <Box
            component="span"
            sx={{
              display: "block",
              width: 8,
              height: 8,
              bgcolor: stockDotColor,
            }}
            aria-hidden="true"
          />
          <Typography variant="body2" sx={{ fontSize: 12, color: "text.secondary" }}>
            {stock.label}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 1, mt: "auto" }}>
        {product.stockQuantity > 0 ? (
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            endIcon={<AddIcon />}
          >
            Add to cart
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            endIcon={<NotificationsNoneIcon />}
          >
            Notify me
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
