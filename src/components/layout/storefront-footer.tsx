"use client";

import Link from "next/link";
import {
  Container,
  Typography,
  Divider,
  Box,
  Link as MuiLink,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Logo } from "./logo";

const shopLinks = [
  { name: "Phones", href: "/categories/phones" },
  { name: "Headphones", href: "/categories/headphones" },
  { name: "Earphones", href: "/categories/earphones" },
  { name: "Chargers", href: "/categories/chargers" },
  { name: "Smartwatches", href: "/categories/smartwatches" },
];

const helpLinks = [
  { name: "Contact us", href: "/help/contact" },
  { name: "Shipping info", href: "/help/shipping" },
  { name: "Returns", href: "/help/returns" },
  { name: "FAQ", href: "/help/faq" },
];

const accountLinks = [
  { name: "Sign in", href: "/account" },
  { name: "My orders", href: "/account/orders" },
  { name: "Track order", href: "/orders/track" },
  { name: "Wishlist", href: "/account/wishlist" },
];

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { name: string; href: string }[];
}) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 2 }}>
        {heading}
      </Typography>
      <Box className="flex flex-col gap-2">
        {links.map((link) => (
          <MuiLink
            key={link.name}
            component={Link}
            href={link.href}
            underline="none"
            sx={{
              fontSize: 14,
              color: "text.primary",
              "&:hover": { color: "primary.main" },
              transition: "color 0.2s",
            }}
          >
            {link.name}
          </MuiLink>
        ))}
      </Box>
    </Box>
  );
}

export function StorefrontFooter() {
  return (
    <Box component="footer" sx={{ mt: "auto", borderTop: "2px solid", borderColor: "divider" }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 5 }, py: 6 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Logo size="small" />
            <Typography
              variant="body2"
              sx={{ mt: 2, maxWidth: 320, lineHeight: 1.7, color: "text.secondary" }}
            >
              Sri Lanka&apos;s trusted destination for mobile phones and
              accessories. Genuine products, official warranty, and fast
              island-wide delivery.
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FooterColumn heading="Shop" links={shopLinks} />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FooterColumn heading="Help" links={helpLinks} />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FooterColumn heading="Account" links={accountLinks} />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      <Container
        maxWidth={false}
        sx={{ px: { xs: 2, md: 5 }, py: 2 }}
      >
        <Box className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <Typography variant="body2" sx={{ fontSize: 12, color: "text.secondary" }}>
            &copy; 2026 CellCraze. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 12, color: "text.secondary" }}>
            Visa &middot; Mastercard &middot; Cash on delivery &middot; Bank
            transfer
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
