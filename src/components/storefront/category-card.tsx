"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, Typography, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export interface CategoryCardData {
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
  index: number;
}

interface CategoryCardProps {
  category: CategoryCardData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const indexLabel = String(category.index).padStart(2, "0");

  return (
    <Card
      component={Link}
      href={`/categories/${category.slug}`}
      sx={{
        textDecoration: "none",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "primary.main" },
        "&:hover .category-name": { color: "primary.main" },
        "&:hover .category-arrow": { color: "primary.main" },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1, p: 2.5, "&:last-child": { pb: 2.5 } }}>
        {/* Index */}
        <Typography
          variant="body2"
          sx={{ fontSize: 12, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}
        >
          {indexLabel}
        </Typography>

        {/* Image well */}
        <Box
          sx={{
            position: "relative",
            aspectRatio: "1/1",
            bgcolor: "background.default",
            overflow: "hidden",
          }}
        >
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-contain grayscale"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <Box sx={{ width: "100%", height: "100%", bgcolor: "background.default" }} />
          )}
        </Box>

        {/* Name + count */}
        <Box>
          <Typography
            className="category-name"
            sx={{
              fontSize: 18,
              fontWeight: 800,
              lineHeight: 1.25,
              color: "text.primary",
              transition: "color 0.2s",
            }}
          >
            {category.name}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
            {category.productCount} products
          </Typography>
        </Box>

        {/* Arrow */}
        <ArrowForwardIcon
          className="category-arrow"
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            fontSize: 18,
            color: "text.disabled",
            transition: "color 0.2s",
          }}
        />
      </CardContent>
    </Card>
  );
}
